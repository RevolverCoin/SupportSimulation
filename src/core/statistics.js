import {List, fromJS, Map, Range} from 'immutable'
const json2csv = require('json2csv');
import {getNodeOfType} from './core'
import {createAdjacencyMatrix, getAdjacentNodes} from './utils'
import * as NodeType from "../constants/NodeType";


export function clearStatistics(state) {
    return state.delete('statistics')
}

export function addStatisticsRaw(state, data, mag, dens) {
    return state.updateIn(['statistics', 'raw'], List(), raw => raw.push(fromJS({mag, dens, data})))
}

export function computeStatistics(state) {
    const getNodesAvgReward = (matrix, nodes) => {
        //calculate rewards for each node of specified degree
        const avg = nodes.reduce((acc, next) => {
            const adjCount = getAdjacentNodes(next.get('id'), matrix).size
            console.log("reward", next.toJS(), next.get('reward'))
            return acc.update(adjCount, List(), l => l.push(next.get('reward') || 0))
        }, Map())


        const getAvg = (list) => list.reduce((acc, next) => acc + next, 0) / list.size

        return avg.keySeq().reduce((acc, next) => {
            return acc.set(next, getAvg(avg.get(next)))
        }, Map())
    }

    let wave = 0;

    const result = state
        .getIn(['statistics', 'raw'])
        .reduce((acc, entry) => {
            const mag = entry.get('mag')
            const dens = entry.get('dens')
            const stateSnapshot = entry.get('data')

            const matrix = createAdjacencyMatrix(stateSnapshot.get('edges'))

            const authors = getNodeOfType(stateSnapshot, NodeType.AUTHOR)
            const supporters = getNodeOfType(stateSnapshot, NodeType.SUPPORTER)
            const generators = getNodeOfType(stateSnapshot, NodeType.GENERATOR)

            return acc.update(wave++, Map(), val => val
                .set('mag', mag)
                .set('dens', dens)
                .set('avgAuthorsRewardList', getNodesAvgReward(matrix, authors))
                .set('avgSupportersRewardList', getNodesAvgReward(matrix, supporters))
                .set('avgGeneratorsRewardList', Map(), getNodesAvgReward(matrix, generators))
                .set('minDistToGenerator', stateSnapshot.get('minDistToGenerator'))
            )


        }, Map())

    return state.setIn(['statistics', 'processed'], result)

}


export function postProcess(statistics) {

    //max support count of all rounds
    const maxSupportCount = statistics.reduce((acc, next) => {
        return Math.max(acc,
            next.get('avgAuthorsRewardList').keySeq().size,
            next.get('avgSupportersRewardList').keySeq().size,
            next.get('avgGeneratorsRewardList').keySeq().size)
    }, 0)


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

export function dumpCSV(data, maxSupportCount = 1) {

    const supportIndexes = Range(0, maxSupportCount)
        .toJS()
        .map(index => index.toString())

    const fields = ['mag', 'dens', ...supportIndexes];

    try {
        const result = json2csv({data, fields});
        console.log(result);
    } catch (err) {
        // Errors are thrown for bad options, or if the data is empty and no fields are provided.
        // Be sure to provide fields if it is possible that your data array will be empty.
        console.error(err);
    }
}