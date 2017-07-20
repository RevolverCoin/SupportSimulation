import {getAdjacentNodes, createAdjacencyMatrix, unsetAdjacencyMatrixIndices, isTerminal} from "./utils";
import * as NodeType from "../constants/NodeType";
import {fromJS, List, Map} from 'immutable'


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
function rewardNodes({node, matrix, inputReward, height, getWeights, getNodeType}) {
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
        const fee = (getNodeType(nodeId) === NodeType.AUTHOR ? 0.7 : 0.06)
        return reward * fee
    })


    const rewardMap = authorsReward
        .reduce((acc, reward, index) => acc.set(adjacentNodes.get(index), reward), Map())

    const outputReward = edgeReward.map((reward, index) => {
        const nodeId = adjacentNodes.get(index);
        const fee = (getNodeType(nodeId) === NodeType.AUTHOR ? 0.7 : 0.06)
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
            if (getNodeType(nodeId) === NodeType.AUTHOR) {
                return getAdjacentNodes(nodeId, matrix).size;
            }
            return 1 / nodes.size
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


export function distributeReward(state, block, getNodeType, authorFee, supporterFee) {
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
    //   .update ("nodes", nodes=>nodes.map(n=>n.update("label","",l=>''+n.get("reward"))))
}