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

        case actions.GENERATE_BLOCKS:
          return core.generateBlocks(state, action.data.nodes, action.data.supporterFee, action.data.authorFee )

        case actions.GENERATE_POS_BLOCK:
            return core.generatePOSBlock(state, action.data.count, 10, action.data.nodeId, action.data.supporterFee, action.data.authorFee)

        case actions.ESTABLISH_SUPPORT :
            return core.establishSupport(state, action.data.nodes, action.data.sMin, action.data.sMax, action.data.tMin, action.data.tMax, action.data.avgSupport)

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

        case actions.SET_CREATE_SIMULATION_POPUP_OPEN:
            return state.set('isCreateSimulationModalOpen', action.data)

        case actions.SET_CHARTS_DATA_POPUP_OPEN:
            return state.set('isChartsDataModalOpen', action.data)

        case actions.SET_CHARTS_POPUP_OPEN:
            return state.set('isChartsModalOpen', action.data)

        case actions.SET_CHARTS_POPUP_ITERATION:
            return state.set('chartsModalIteration', action.data)

        case actions.SET_STATISTICS_CHART_DATA:
            return state.setIn(['charts',action.data.chartId], action.data.data)    

        default:
            return state;
    }
}
