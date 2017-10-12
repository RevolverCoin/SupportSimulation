import {List, fromJS, Map, Range} from 'immutable'

const json2csv = require('json2csv');
import downloadCsv from 'download-csv';


import {getNodeOfType} from './core'
import {createAdjacencyMatrix, listAverage, getAdjacentNodes} from './utils'
import * as NodeType from "../constants/NodeType";


export function clearStatistics(state) {
    return state.delete('statistics')
}

export function addStatisticsRaw(state, data) {
    return state.updateIn(['statistics', 'raw'], List(), raw => raw.push(fromJS(data)))
}

export function computeStatistics(state) {
    const getNodesAvgReward = (matrix, nodes, totalReward) => {
        nodes = nodes.filter(n=>!!n.get('reward'))
        //calculate rewards for each node of specified degree
        const avg = nodes.reduce((acc, next) => {
            const adjCount = getAdjacentNodes(next.get('id'), matrix).size
            const reward = (next.get('reward') || 0 )
            return acc.update(adjCount, List(), l => l.push(reward))
        }, Map())


        const getAvg = (list) => list.reduce((acc, next) => acc + next, 0) / list.size
        const result = avg.keySeq().reduce((acc, next) => {
            return acc.set(next, getAvg(avg.get(next)))
        }, Map())
        return result;
    }

    /**
     * averages results of all samples of the round
     */
    const calcSamplesAverage = (round) => {
        //calcs total reward for specified nodes
        const getTotalReward = (rewards) => rewards ? (rewards.keySeq().reduce((acc, next) => {
            return acc + (List.isList(rewards.get(next)) ? rewards.get(next).reduce((a, n) => a + n||0, 0) : rewards.get(next)||0)
        }, 0)):0

        const calcAvg = (rewards) => rewards ? rewards.keySeq().reduce((acc, next) => {
            return acc.set(next, List.isList(rewards.get(next)) ? (
                    rewards.get(next).reduce((a, n) => a + n, 0) / rewards.get(next).size
                ) : (
                    rewards.get(next)
                )
            )
        }, Map()) : Map()


        const result = round
            .reduce((acc, next) => {

                const merger = (oldVal, newVal) => {
                    const result = List.isList(newVal) ? newVal : List.of(newVal)
                    return oldVal ? result.push(oldVal) : result
                }

                return acc
                    .set('mag', next.get('mag'))
                    .set('dens', next.get('dens'))
                    .set('pGen', next.get('pGen'))
                    .set('pAuth', next.get('pAuth'))
                    .set('sampleSize',  next.get('sampleSize') )
                    .update('realDensity', List(), d => d.push(next.get('realDensity')))
                    .update('avgAuthorsRewardList', Map(), map => next.get('avgAuthorsRewardList').mergeWith(merger, map))
                    .update('avgSupportersRewardList', Map(), map => next.get('avgSupportersRewardList').mergeWith(merger, map))
                    .update('avgGeneratorsRewardList', Map(), map => next.get('avgGeneratorsRewardList').mergeWith(merger, map))
                    .update('minDistToGenerator', Map(), map => next.get('minDistToGenerator').mergeWith(merger, map))
            }, Map())

        const authorsReward = getTotalReward(result.get('avgAuthorsRewardList'))
        const supportersReward = getTotalReward(result.get('avgSupportersRewardList'))
        const generatorsReward = getTotalReward(result.get('avgGeneratorsRewardList'))
        const roundDistributedReward = authorsReward + supportersReward + generatorsReward;

        return result.update('avgAuthorsRewardList', l => calcAvg(l))
            .update('avgSupportersRewardList', l => calcAvg(l))
            .update('avgGeneratorsRewardList', l => calcAvg(l))
            .set('authorsReward', authorsReward/roundDistributedReward)
            .set('supportersReward', supportersReward/roundDistributedReward)
            .set('generatorsReward', generatorsReward/roundDistributedReward)
            .update('minDistToGenerator', l => calcAvg(l))
            .update('realDensity', l => Math.round(1000 * listAverage(l)) / 1000)
    }


    let wave = 0;


    const result = state
        .getIn(['statistics', 'raw'])
        .reduce((acc, entry) => {
            const mag = entry.get('mag')
            const dens = entry.get('dens')
            const round = entry.get('round')
            const pAuth = entry.get('pAuth')
            const pGen = entry.get('pGen')
            const sampleSize = entry.get('sampleSize')
            const stateSnapshot = entry.get('data')

            const getTotalReward = nodes => nodes.reduce((acc, next) => acc + (next.get('reward') || 0), 0)



            const matrix = createAdjacencyMatrix(stateSnapshot.get('edges'))

            const authors = getNodeOfType(stateSnapshot, NodeType.AUTHOR)
            const supporters = getNodeOfType(stateSnapshot, NodeType.SUPPORTER)
            const generators = getNodeOfType(stateSnapshot, NodeType.GENERATOR)

            const authorsReward = getTotalReward(authors)
            const supportersReward = getTotalReward(supporters)
            const generatorsReward = getTotalReward(generators)
            const roundDistributedReward = authorsReward + supportersReward + generatorsReward;

            return acc.update(wave++, Map(), val => val
                .set('round', round)
                .set('mag', mag)
                .set('dens', dens)
                .set('pGen', pGen)
                .set('pAuth', pAuth)
                .set('sampleSize', sampleSize)
                .set('avgAuthorsRewardList', getNodesAvgReward(matrix, authors, roundDistributedReward))
                .set('avgSupportersRewardList', getNodesAvgReward(matrix, supporters, roundDistributedReward))
                .set('avgGeneratorsRewardList', getNodesAvgReward(matrix, generators, roundDistributedReward))
                .set('realDensity', 2 * stateSnapshot.get('edges').size / (mag * (mag - 1)))
                .set('minDistToGenerator', stateSnapshot.get('minDistToGenerator'))
            )
        }, Map())
        .groupBy(x => x.get('round'))
        .reduce((acc, next, index) => acc.set(index, calcSamplesAverage(next)), Map())

    return state.setIn(['statistics', 'processed'], result)

}


export function postProcess(statistics) {

    //max support count of all rounds
    const {maxSupportCount, totalReward} = statistics.reduce((acc, next) => {
        return {
            maxSupportCount: Math.max(acc.maxSupportCount,
                next.get('avgAuthorsRewardList').keySeq().sort().last() || 0,
                next.get('avgSupportersRewardList').keySeq().sort().last() || 0,
                next.get('avgGeneratorsRewardList').keySeq().sort().last() || 0),
            totalReward: acc.maxSupportCount + next.get('roundDistributedReward')
        }
    }, {maxSupportCount: 0})


    const createRewardRow = (stats, list) => {
        const entries = {}
        for (let i = 0; i < maxSupportCount; ++i) {
            entries[i] = undefined
        }
        const avgReward = stats.get(list).toJS()
        return Object.assign({}, entries, avgReward)
    }

    return statistics.reduce((acc, next) => {

        acc.avgAuthorsRewardList.push({
            mag: next.get('mag'),
            dens: next.get('dens'), ...createRewardRow(next, 'avgAuthorsRewardList')
        })

        acc.avgGeneratorsRewardList.push({
            mag: next.get('mag'),
            dens: next.get('dens'), ...createRewardRow(next, 'avgGeneratorsRewardList')
        })


        acc.avgSupportersRewardList.push({
            mag: next.get('mag'),
            dens: next.get('dens'), ...createRewardRow(next, 'avgSupportersRewardList')
        })


        return acc;

    }, {maxSupportCount, avgAuthorsRewardList: [], avgGeneratorsRewardList: [], avgSupportersRewardList: []})
}

export function dumpCSV(data, maxSupportCount = 1, exportFileName) {

    const supportIndexes = Range(0, maxSupportCount)
        .toJS()
        .map(index => index.toString())

    const fields = ['mag', 'dens', ...supportIndexes];

    try {
        if (exportFileName) {
            downloadCsv(data, fields, exportFileName);
        }
        else {
            const result = json2csv({data, fields});
            console.log(result);
        }

    } catch (err) {
        // Errors are thrown for bad options, or if the data is empty and no fields are provided.
        // Be sure to provide fields if it is possible that your data array will be empty.
        console.error(err);
    }
}