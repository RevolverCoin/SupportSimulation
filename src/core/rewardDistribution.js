import {
    getAdjacentNodes,
    getAdjacentNodesSet as getAdjSet,
    createAdjacencyMatrix,
    unsetAdjacencyMatrixIndices,
    isTerminal,
    getChildren,
    getParents
} from "./utils";
import * as NodeType from "../constants/NodeType";
import {fromJS, List, Set, Map} from 'immutable'
const memoize = require('memoizee');
//const memoize = require('memoize-immutable');
var memProfile = require('memoizee/profile');
const getAdjacentNodesSet = memoize(getAdjSet, { profileName: 'getAdjacentNodesSet' })

/**
 *
 * @param node - source node
 * @param matrix
 * @param inputReward Map<nodeId, int> map of input reward stream for each node
 * @param height current blockchain height
 * @param getWeights % of the reward each node gets
 * @param fee
 * @returns {{reward: (*|Map<any, any>|Map<string, any>|R), outputRewardMap: (*|Map<any, any>|Map<string, any>|R), adjacentNodes: *, matrix: *}}
 */
function rewardNodes({node, matrix, inputReward, height, getWeights, getNodeType, authorFee, supporterFee}) {

    //get adjacent  nodes
    const adjacentNodes = getAdjacentNodes(node, matrix)

    const weights = getWeights(adjacentNodes);
    const sum = weights.reduce((a, n) => a + n, 0)
    const normalizedWeight = weights.map(p => p / sum)

    const updatedMatrix = adjacentNodes && adjacentNodes.size ? (
        unsetAdjacencyMatrixIndices(matrix, true, ...adjacentNodes.map(nodeId => ({target: nodeId, source: node})))
    ) : matrix


    //reward stream from @node to adjacentNodes nodes
    const edgeReward = normalizedWeight.map(w => inputReward.get(node) * w)


    const authorsReward = edgeReward.map((reward, index) => {
        const nodeId = adjacentNodes.get(index);
        const fee = (getNodeType(nodeId) === NodeType.AUTHOR ? authorFee : supporterFee)
        return reward * fee
    })


    const rewardMap = authorsReward
        .reduce((acc, reward, index) => acc.set(adjacentNodes.get(index), reward), Map())

    const outputReward = edgeReward.map((reward, index) => {
        const nodeId = adjacentNodes.get(index);
        const fee = (getNodeType(nodeId) === NodeType.AUTHOR ? authorFee : supporterFee)
        return reward * (1 - fee)
    })

    //map output reward to each adjacentNodes node
    const outputRewardMap = outputReward
        .reduce((acc, reward, index) => acc.set(adjacentNodes.get(index), reward), Map())


    return {
        reward: rewardMap,//reward for each author (authorId->reward)
        outputRewardMap,//output for each adjacentNode (adjacentNodeId->output reward)
        adjacentNodes,//processed nodes
        node,
        matrix: updatedMatrix
    }
}

function processNodes(nodes,
                      matrix,
                      inputReward,
                      reward,
                      getNodeType,
                      authorFee,
                      supporterFee,
                      waveIndex,
                      minDistToGenerator,
                      useTerminalReward = false) {
    //reward during this round
    let curMatrix = matrix;

    const getWeights = (nodes) => nodes.map(nodeId => {
            // if (getNodeType(nodeId) === NodeType.AUTHOR) {
            //     return getAdjacentNodes(nodeId, matrix).size;
            // }
            return 1
        }
    );

    //min distance to generator equals to current wave index since wave starts at the generator
    const updatedMinDistToGen = nodes.reduce((acc, next) => acc.set(next, waveIndex), minDistToGenerator)

    const roundReward = nodes.map(n => {

        const result = rewardNodes({
            node: n,
            matrix: curMatrix,
            inputReward,
            height: 100,
            authorFee,
            supporterFee,
            getWeights,
            getNodeType
        });
        curMatrix = result.matrix;
        return result
    });

    const roundOutputReward = roundReward.reduce((acc, next) => {
        return acc.mergeWith((a, b) => a + b, next.outputRewardMap)
    }, Map());

    const mergedInputReward = roundReward.reduce((acc, next) => {
        return acc.mergeWith((a, b) => a + b, next.outputRewardMap)
    }, inputReward);

    let mergedReward = roundReward.reduce((acc, next) => {
        return acc.mergeWith((a, b) => a + b, next.reward)
    }, reward);


    roundReward.map(r => {
        return r;
    });


    const terminalNodesIndices = roundOutputReward
        .keySeq()
        .filter(node => !isTerminal(node, curMatrix));


    if (useTerminalReward) {
        const terminalNodesReward = terminalNodesIndices.reduce((acc, id) => acc.delete(id), roundOutputReward);
        mergedReward = mergedReward.mergeWith((a, b) => a + b, terminalNodesReward)
    }


    const processedNodes = roundReward.map(r => r.outputRewardMap.keySeq()).flatten().toSet().toList();
    //we have more nodes to process
    if (processedNodes.size) {
        return processNodes(processedNodes, curMatrix, mergedInputReward, mergedReward, getNodeType, authorFee, supporterFee, ++waveIndex, updatedMinDistToGen)
    }

    return {mergedReward, minDistToGenerator: updatedMinDistToGen}
}

/**
 * stream distribution
 * @param {*} state 
 * @param {*} block 
 * @param {*} getNodeType 
 * @param {*} authorFee 
 * @param {*} supporterFee 
 */
export function distributeReward2({state, block, getNodeType, authorFee, supporterFee}) {
    const finder = block.get("finderId");
    const matrix = createAdjacencyMatrix(state.get("edges"));
    const inputReward = Map().set(finder, block.get("subsidy"));
    const {mergedReward, minDistToGenerator} = processNodes(List.of(finder), matrix, inputReward, Map(), getNodeType, authorFee, supporterFee, 0, Map())


    return state
        .set("minDistToGenerator", minDistToGenerator)
        .update("nodes", nodes => nodes.map(n => {
            const hasRewardUpdate = mergedReward.has(n.get('id'));
            return hasRewardUpdate ? n.update("reward", 0, r => r + mergedReward.get(n.get('id'))) : n
        }));
}


/**
 * breadth first search based traversal
 * @param {*} matrix adjacency matrix
 * @param {*} startNode id of starting node
 * @param {*} visitFn function to be called for each node with following params
 *  (nodeId, parents, parentChildren : map <nodeId, children> of prev nodes)
 */
function bfs(matrix, startNode, visitFn) {
    const listToExplore = [startNode];
    let visited = Set.of(startNode)
    let parentChildren = Map()

    do {
      const nodeIndex = listToExplore.shift();
      const nodeChildren = getAdjacentNodesSet(nodeIndex, matrix).subtract(visited)
      //populate parent->children map to determine number of outputs for each parents later
      parentChildren =   parentChildren.update(nodeIndex, n=>n ? n : nodeChildren)
      parentChildren = nodeChildren.reduce( (acc,next)=>{
        return acc.update(next, r=>r ? r :  getAdjacentNodesSet(next, matrix).subtract(visited))
      }, parentChildren)

      nodeChildren.forEach(childId => {
          visited = visited.add(childId);
          listToExplore.push(childId)
          const adjacent = getAdjacentNodesSet(childId, matrix)
          visitFn(childId, adjacent.intersect(visited), parentChildren)
      })
    }
    while(listToExplore.length > 0 && visited.size < matrix.size)
};

/**
 * BFS based distribution
 * @param {*} param0 
 */
export function distributeReward({state, adjacencyMatrix, block, getNodeFee}) {
    const matrix = adjacencyMatrix || createAdjacencyMatrix(state.get("edges"));

    const finder = block.get("finderId");
    //reward of each node
    let reward = Map().set(finder, block.get("subsidy") * getNodeFee(finder));
    //total output reward for each node
    let outReward = Map().set(finder, block.get("subsidy") * (1 -  getNodeFee(finder)));

    const mergeReward = (nodeId, parents, parentChildren) => {
        //cumulative node reward
        const nodeReward = parents.reduce((acc, next) => {
          const children =  parentChildren.get(next)
          const childrenCount =  children && children.size || 1
          return acc +  outReward.get(next) / childrenCount
        },0)

        const fee = getNodeFee(nodeId)
        //reward that belongs to node
        reward = reward.set(nodeId, nodeReward * fee)
        //out reward
        outReward = outReward.set(nodeId, nodeReward * (1 - fee))
    }

    console.time("bfs");
    bfs(matrix, finder, mergeReward)
    console.timeEnd("bfs");

    return state
        .set("minDistToGenerator", List())
        .update("nodes", nodes => nodes.map(n => {
            const hasRewardUpdate = reward.has(n.get('id'));
            return hasRewardUpdate ? n.update("reward", 0, r => {
               const rounded  =  Math.round(100000000* reward.get(n.get('id')))/100000000
               return r + rounded
            }) : n
        }));
}
