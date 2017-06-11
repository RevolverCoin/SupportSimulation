import {List, Map, Range} from 'immutable'

import {getNodeOfType} from './core'
import * as NodeType from "../constants/NodeType";


export function clearStatistics(state) {
    return state.delete('statistics')
}

export function addStatisticsRaw(state, data) {
    return state.updateIn(['statistics', 'raw'], List(), raw => raw.push(data))
}

export function computeStatistics(state) {
    const getListAvg = (list) => list.reduce((acc, next) => acc + next, 0) / list.size

    const result = state
        .getIn(['statistics', 'raw'])
        .reduce((acc, stateSnapshot) => {
            const authors = getNodeOfType(stateSnapshot, NodeType.AUTHOR)
            const supporters = getNodeOfType(stateSnapshot, NodeType.SUPPORTER)
            const generators = getNodeOfType(stateSnapshot, NodeType.GENERATOR)


            const avgAuthorsReward = getListAvg(authors)
            const avgSupportersReward = getListAvg(supporters)
            const avgGeneratorsReward = getListAvg(generators)

            return acc
                .update('avgAuthorsRewardList', List(), reward => reward.push(avgAuthorsReward))
                .update('avgSupportersRewardList', List(), reward => reward.push(avgSupportersReward))
                .update('avgGeneratorsRewardList', List(), reward => reward.push(avgGeneratorsReward))


        }, Map())
        .map(entry => entry
            .set('avgAuthorsReward', getListAvg(entry.get('avgAuthorsRewardList')))
            .set('avgSupportersReward', getListAvg(entry.get('avgSupportersRewardList')))
            .set('avgGeneratorsReward', getListAvg(entry.get('avgGeneratorsRewardList')))
        )


    return result

}