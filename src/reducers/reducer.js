import * as actions from '../constants/ActionType'
import * as core from '../core/core'
import * as statistics from '../core/statistics'


import {INITIAL_STATE} from '../core/core'
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actions.CREATE_AUTHOR :
            return core.createAuthor(state, action.data.count);

        case actions.CREATE_GENERATOR :
            return core.createGenerator(state, action.data.count);

        case actions.CREATE_SUPPORTER :
            return core.createSupporter(state, action.data.count);

        case actions.UPDATE_AUTHORS_SUPPORT_PROBABILITY :
            return core.updateAuthorsSupportProbability(state);


        case actions.UPDATE_POS_BLOCK_PROBABILITY :
            return core.updatePOSBlockProbability(state);

        case actions.GENERATE_POS_BLOCK:
            return core.generatePOSBlock(state, action.data.count, 10, action.data.nodeId)

        case actions.ESTABLISH_SUPPORT :
            return core.establishSupport(state, action.data.nodes, action.data.sMin, action.data.sMax, action.data.tMin, action.data.tMax)

        case actions.CREATE_SIMULATION:
            return core.createSimulation(state, action.data)

        case actions.RESET_STATE:
            return core.resetState(state)

        case actions.RESTART_STATE:
            return core.restart(state);

        case actions.CLEAR_STATISTICS:
            return statistics.clearStatistics(state)

        case actions.ADD_STATISTICS_RAW:
            return statistics.addStatisticsRaw(state, action.data)

        case actions.COMPUTE_STATISTICS:
            return statistics.computeStatistics(state)

        case actions.UPDATE_STRUCTURE:
            return core.updateStructure(state);

        default:
            return state;
    }
}