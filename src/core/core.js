import {fromJS, Range, Map, Repeat, List, Set} from "immutable";
import * as NodeType from "../constants/NodeType";
import {getRandomInt, createAdjacencyMatrix} from "./utils";

const rand = require('random-seed').create('seed')

import {distributeReward} from './rewardDistribution'


export const INITIAL_STATE = fromJS({
    blocks: [],
    lastNodeId: 0,
    nodes: [],
    edges: []
});

function createNode(count, baseId, nodeType, createParams) {
    return Range(0, count).map(index => Map({
        id: baseId + index,
        label: `${nodeType[0]}${baseId + index}`,
        type: nodeType,
        title: '',
        shape: "circle",
        scaling: {
            min: 2,
            max: 50,
            label: {
                min: 2,
                max: 40
            }
        },
        x: getRandomInt(0, 900),
        y: getRandomInt(0, 600),
        ...createParams(index)
    })).toList()

}

export function resetState(state) {
    return INITIAL_STATE.set('statistics', state.get('statistics'))
}

export function restart(state) {
    return state.merge(INITIAL_STATE);
}

export function createAuthor(state, count) {
    const nodeId = state.get('lastNodeId');
    return state
        .update('lastNodeId', id => id + count)
        .update('nodes', n => n.concat(createNode(count, nodeId, NodeType.AUTHOR,
            (index) => ({

                color: "#6dcff6",

                title: "",
                mass: 200,
                popularity: getRandomInt(0, 100)
            })))
        );
}

export function createGenerator(state, count) {
    const nodeId = state.get('lastNodeId');
    return state
        .update('lastNodeId', id => id + count)
        .update('nodes', n => n.concat(createNode(count, nodeId, NodeType.GENERATOR,
            (index) => ({
                //label: `r${nodeId + index}`,
                posBalance: getRandomInt(0, 100),
                color: "#fdc689",
                mass: 1,
                activity: getRandomInt(0, 100)
            })))
        )
}

export function createSupporter(state, count) {
    const nodeId = state.get('lastNodeId');
    return state
        .update('lastNodeId', id => id + count)
        .update('nodes', n => n.concat(createNode(count, nodeId, NodeType.SUPPORTER,
            (index) => ({
                size: 5,
                color: "#7cc576",

                mass: 1,
                activity: Math.random()
            })))
        )
}

export function updateNodeProbability(state, nodeType, metricName, probField) {
    const nodes = getNodeOfType(state, nodeType)
    const metric = nodes.map(a => a.get(metricName))
    const sum = metric.reduce((a, n) => a + n, 0)
    const probs = metric.map(p => p / sum)

    let index = 0;
    return state.update('nodes', nodes => nodes.map((node) => {
        if (node.get('type') === nodeType) {
            return node.set(probField, probs.get(index++))
        }
        return node
    }))
}


export function updateAuthorsSupportProbability(state) {
    return updateNodeProbability(state, NodeType.AUTHOR, 'popularity', 'supportProb')
}

export function updatePOSBlockProbability(state) {
    return updateNodeProbability(state, NodeType.GENERATOR, 'posBalance', 'blockProb')
}


export function createSimulation({magMin, magMax, magStep, densMin, densMax, densStep, numBlocks}) {
    const magRange = Range(magMin, magMax, magStep);
    const densRange = Range(densMin, densMax, densStep)

    magRange.forEach(mag => {
        densRange.forEach(dens => {
            let stepState = INITIAL_STATE;
            const genCount = mag / 3;
            const authCount = mag / 3;
            const supCount = mag / 3;

            stepState = createGenerator(stepState, genCount)
            stepState = createAuthor(stepState, authCount)
            stepState = createSupporter(stepState, supCount)
            stepState = establishSupport(stepState, supCount)

            const generators = getNodeOfType(stepState, NodeType.GENERATOR)

            generators.reduce((state, generator) => {
                return generatePOSBlock(stepState, 1, 50, generator.get('id'))
            }, stepState)


        })
    })

}


function getTotalRewardOfType(state, node) {
    return state.get('nodes').reduce((acc, next) => {
        let cur = 0;
        if (next.get('type') === node.get('type')) {
            cur = next.get('reward');
            if (!cur)
                cur = 0;
        }
        return acc + cur;
    }, 0);
}

/* action for updated structure, when tooltips update occurs */
export function updateStructure(state) {
    return state.update('nodes', nodes => {
        return nodes.map(node => {

            const edges = state.get('edges');
            const supports = edges.filter(value => value.get('source') === node.get('id'));
            const supporters = edges.filter(value => value.get('target') === node.get('id'));
            const supportersGen = edges.filter(value => value.get('target') === node.get('id') && isGen(state, value.get('source')));

            // update generator color

            let color = node.get('color');
            if (node.get('type') === 'generator') {

                color = "#fdc689";

                const blocks = state.get('blocks');
                if (blocks && !blocks.isEmpty()) {

                    if (node.get('id') === blocks.last().get('finderId')) {
                        color = '#ff0000';
                    }

                }
            }


            let typeRewardTotal = getTotalRewardOfType(state, node);

            let nodeTypeReward = 0;
            if (typeRewardTotal && typeRewardTotal !== 0)
                nodeTypeReward = (node.get('reward') ? node.get('reward') / typeRewardTotal * 100 : 0);


            let totalReward = state.get('blocks').reduce((acc, next) => acc + next.get('blockReward'), 0);

            let nodeTotalReward = 0;
            if (totalReward && totalReward !== 0) {
                nodeTotalReward = (node.get('reward') ? node.get('reward') / totalReward * 100 : 0);
            }

            const title =
                "<p>Type: " + node.get('type') + "</p>" +
                "<p>Id: " + node.get('id') + "</p>" +
                "<p>Supports: " + supports.size + "</p>" +
                "<p>Supporters: " + supporters.size + "</p>" +
                "<p>Supporters Gen: " + supportersGen.size + "</p>" +
                "<p>Reward: " + node.get('reward') + "</p>" +
                "<p>Reward type %: " + nodeTypeReward + "</p>" +
                "<p>Reward total %: " + nodeTotalReward + "</p>";


            const prevValue = node.get('value');

            if (prevValue) {
                if (nodeTypeReward > prevValue) {
                    if (nodeTypeReward > prevValue + 1)
                        nodeTypeReward = prevValue + 1;
                    else
                        nodeTypeReward = prevValue + (nodeTypeReward - prevValue) / 2;
                } else {
                    if (nodeTypeReward < prevValue - 1)
                        nodeTypeReward = prevValue - 1;
                    else
                        nodeTypeReward = prevValue - (prevValue - nodeTypeReward) / 2;
                }
            } else {
                nodeTypeReward = 0.1;
            }
            return node.merge({title: title, value: nodeTypeReward, color});
        });

    });
}

/**
 *
 * @param state
 * @param nodes list of source node objects
 * @param sMin minimum number of supports per node
 * @param sMax maximum number of supports per node
 */
export function establishSupport(state, nodes, sMin, sMax, tMin, tMax, avgSupport) {
    const allAuthors = getAuthors(state).map(a=>a.get('id')).toSet()

    //returns random author node id based on probability table
    const getRandomAuthor = (table) => table.get( Math.floor(Math.random()*table.size))
    return state.update('edges', edges => {
        let result = edges;
        let nodeCount = nodes.size
        nodes.forEach((node, index) => {
            //set of authors that were supported by current node
            let supportedAuthors = Set()
            const supportCount = getRandomInt(sMin, Math.min(sMax, allAuthors.size + 1));
            result =  result.concat(Repeat(0, supportCount).map(() => {
                    const table = allAuthors.subtract(supportedAuthors)
                    let authorId = table.size === 1 ? table.toList().first() : getRandomAuthor(table.toList());
                    supportedAuthors = supportedAuthors.add(authorId)
                    const nodeId = `${node.get('id')}_${authorId}`
                    return Map({
                        id: nodeCount++,
                      //  arrows: {to: {enabled: false}},
                        source: node.get('id'),
                        target: authorId,
                      //  width: 3,
                     //   label: "supports",
                       // age: getRandomInt(tMin, tMax)
                    })
                })
            )

        })
        return result
    })
}

/**
 *
 * @param probTable
 * @param exclude - set of node ids to exclude from selection
 * @returns {any|T|*}
 */
function getRandomNodeId(probTable, exclude) {
    const r = rand.random();
    const entry = probTable.find(a => (!exclude || !exclude.has(a.get('id'))) && a.get('prob') >= r) || probTable.first()
    return entry.getIn(['node', 'id'])
}

function buildAuthorsProbTable(state) {
    return buildNodesProbTable(getAuthors(state), 'supportProb');
}

function buildGeneratorsPOSProbTable(state) {
    return buildNodesProbTable(getGenerators(state), 'blockProb');
}

/**
 *
 * @param state
 * @param nodes
 * @param probField name of probability field on @nodes array
 * @returns {*|List<any>|List<any>|R}
 */
function buildNodesProbTable(nodes, probField) {

    const probIsFunction = (typeof probField === "function")

    return nodes.reduce((acc, node) => {
        const curCumulativeProb = acc.last() ? acc.last().get('prob') : 0;
        const prob = probIsFunction ? probField() : node.get(probField)
        return acc.push(Map({node, prob: curCumulativeProb + prob}))
    }, List())
}




export function getNodeOfType(state, nodeType) {
    return state.get('nodes').filter(node => node.get('type') === nodeType);
}

export function isGen(state, nodeId) {

    const node = state.get('nodes').find(node => node.get('id') === nodeId);
    return node.get('type') === 'generator';
}

export function getAuthors(state) {
    return getNodeOfType(state, NodeType.AUTHOR);
}

export function getSupporters(state) {
    return getNodeOfType(state, NodeType.SUPPORTER);
}

export function getGenerators(state) {
    return getNodeOfType(state, NodeType.GENERATOR);
}


function createBlock(state, subsidy, nodeId, supporterFee, authorFee) {
    const probTable = buildGeneratorsPOSProbTable(state);
    //returns random author node id based on probability table
    const finderId = nodeId || getRandomNodeId(probTable)
    const block = Map({finderId, subsidy, blockReward: 10})

    state = state.update(['sim', 'totalReward'], val => val + block.get('blockReward'));

    const getNodeFee =createGetNodeFeeFunc(state.get('nodes'), authorFee, supporterFee)

    return distributeReward({state : state.update('blocks', blocks => blocks.push(block)), block, getNodeFee})
}

export function generatePOSBlock(state, count, subsidy, nodeId, supporterFee, authorFee) {
    return Range(0, count).reduce((acc, next) => createBlock(acc, subsidy, nodeId, supporterFee, authorFee), state)
}

/**
 * returns function that returns node fee based on type
 * @param {*} nodes list of nodes
 */
export function createGetNodeFeeFunc (nodes, supporterFee, authorFee) {
    const nodeMap = nodes.reduce((acc, next) => acc.set(next.get('id'), next.get('type')=== NodeType.AUTHOR ? authorFee : supporterFee), Map())
    return nodeId => nodeMap.get(nodeId)
}

export function generateBlocks(state, nodes, supporterFee, authorFee) {
    const matrix = createAdjacencyMatrix(state.get("edges"))
    const getNodeFee =createGetNodeFeeFunc(state.get('nodes'), supporterFee, authorFee)
    return nodes.reduce( (acc, next)=>{
        const block = Map({finderId : next.get('id'), subsidy : 10, blockReward: 10})
        acc = acc
          .update(['sim', 'totalReward'], val => val + block.get('blockReward'))
          .update('blocks', blocks => blocks.push(block))

        return distributeReward({state : acc, adjacencyMatrix : matrix, block, getNodeFee})

  }, state)
}
