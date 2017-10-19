import * as types from "../constants/ActionType";
import {getGenerators, getNodeOfType, getSupporters} from "../core/core";
import {Range} from 'immutable'
import * as NodeType from "../constants/NodeType";

import {dumpCSV, postProcess} from '../core/statistics'
import {clearAdjMatrixMemoizeCache} from '../core/rewardDistribution'

export function createAuthor(count) {
    return {
        type: types.CREATE_AUTHOR,
        data: {count}
    }
}

export function createGenerator(count) {
    return {
        type: types.CREATE_GENERATOR,
        data: {count}
    }
}

export function createSupporter(count) {
    return {
        type: types.CREATE_SUPPORTER,
        data: {count}
    }
}

export function updateAuthorsSupportProb() {
    return {
        type: types.UPDATE_AUTHORS_SUPPORT_PROBABILITY
    }
}

export function updatePOSBlockProbs() {
    return {
        type: types.UPDATE_POS_BLOCK_PROBABILITY
    }
}

export function resetState() {
    return {
        type: types.RESET_STATE
    }
}

export function addStatistics({sampleSize, round, mag, dens, pGen, pAuth}) {
    return (dispatch, getState) => {
        dispatch({
            type: types.ADD_STATISTICS_RAW,
            data: {round, data: getState(), mag, dens, pGen, pAuth, sampleSize}
        })
    }
}


export function clearStatistics() {
    return {
        type: types.CLEAR_STATISTICS
    }
}

export function restart() {
    return {
        type: types.RESTART_STATE
    }

}

export function computeStatistics() {
    return {
        type: types.COMPUTE_STATISTICS
    }
}

/**
 *
 * @param magMin - magnitude min
 * @param magMax - magnitude max
 * @param magStep - magnitude step
 * @param densMin - density min
 * @param densMax - density max
 * @param densStep - density step
 * @param supToGenActivity - relative supporter activity compared to generator activity
 * @param pGen - percentage\part of generator nodes
 * @param pAuth - percentage\part of author nodes
 * @param pSup - percentage\part of supported nodes
 * @param sampleSize - number of samples to use for each mag\dens
 * @param useCurrentNetwork - use current graph and don't generate a random one
 * sum of pGen + pAuth + pSup must be equal to 1
 * @returns {function(*=, *=)}
 */
export function createSimulation({
                                     magMin,
                                     magMax,
                                     magStep,
                                     densMin,
                                     densMax,
                                     densStep,
                                     supToGenActivity,
                                     pGen,
                                     pAuth,
                                     pSup,
                                     supporterFee,
                                     authorFee,
                                     sampleSize = 1,
                                     useCurrentNetwork = false,
                                     downloadCSV = false
                                 },) {
    return (dispatch, getState) => {
        console.time("create_simulation");
        const magRange = Range(magMin, magMax, magStep);
        const densRange = Range(densMin, densMax, densStep)

        dispatch(clearStatistics())

        let round = 0;
        magRange.forEach(mag => {
            densRange.forEach(dens => {
                const genCount = Math.floor(mag * pGen);
                const authCount = Math.floor(mag * pAuth);
                const supCount = mag - genCount - authCount;

                const avgGenSupport = 0.5 * dens * mag * (mag - 1) / (genCount + supToGenActivity * supCount )
                const avgSupSupport = avgGenSupport * supToGenActivity

                for (let currentSample = 0; currentSample < sampleSize; ++currentSample) {
                    if (!useCurrentNetwork) {
                        // console.log(`Starting round ${round} mag:${mag}, dens:${dens}, sample : ${currentSample}`)

                        dispatch(createGenerator(genCount))
                        dispatch(createAuthor(authCount))
                        dispatch(createSupporter(supCount))


                        dispatch(updateAuthorsSupportProb())
                        const genSMax = 2 * avgGenSupport - 1;
                        const supSMax = 2 * avgSupSupport - 1;

                        const genDelta = genSMax > authCount ? genSMax - authCount : 0
                        const supDelta = supSMax > authCount ? supSMax - authCount : 0


                        dispatch(establishSupportFromGenerators({sMin: 1 + genDelta, sMax: genSMax - genDelta}))
                        dispatch(establishSupportFromSupporters({sMin: 1 + supDelta, sMax: supSMax - supDelta}))
                    }

                    console.time("simulation");
                    const generators = getNodeOfType(getState(), NodeType.GENERATOR)
                    dispatch(generateBlocks(generators, supporterFee, authorFee))


                    console.timeEnd("simulation");
                    dispatch(addStatistics({sampleSize, round, mag, dens, pGen, pAuth}))
                    clearAdjMatrixMemoizeCache()
                    console.log(`added statistics for round ${round}, sample : ${currentSample}`)
                    if (!useCurrentNetwork) {
                        dispatch(resetState())
                    }
                }

                ++round;
            })
        })

        dispatch(computeStatistics())
        dispatch(updateStructure())
        if (downloadCSV) {
            const postProcessedData = postProcess(getState().getIn(['statistics', 'processed']))
            dumpCSV(postProcessedData.avgAuthorsRewardList, postProcessedData.maxSupportCount, "authorsReward.csv")
            dumpCSV(postProcessedData.avgSupportersRewardList, postProcessedData.maxSupportCount, "supportersReward.csv")
            dumpCSV(postProcessedData.avgGeneratorsRewardList, postProcessedData.maxSupportCount, "generatorsReward.csv")
        }


    }
}

/**
 *
 * @param nodes
 * @param sMin minimum number of supports per node
 * @param sMax maximum number of supports per node
 * @returns {{type, data: {nodes: *}}}
 */
export function establishSupport(nodes, sMin, sMax, tMin, tMax) {
    return {
        type: types.ESTABLISH_SUPPORT,
        data: {nodes, sMin, sMax, tMin, tMax}
    }
}

export function updateStructure() {
    return {
        type: types.UPDATE_STRUCTURE
    }
}

export function establishSupportFromGenerators({sMin = 1, sMax = 8}) {
    return (dispatch, getState) => {
        dispatch(establishSupport(getGenerators(getState()), sMin, sMax, 1, 100))
    }
}

export function establishSupportFromSupporters({sMin = 1, sMax = 6}) {
    return (dispatch, getState) => {
        dispatch(establishSupport(getSupporters(getState()), sMin, sMax, 1, 100))
    }
}

export function generatePOSBlock(count, nodeId, supporterFee, authorFee) {
    return {
        type: types.GENERATE_POS_BLOCK,
        data: {count, nodeId, supporterFee, authorFee}
    }
}

export function generateBlocks(nodes, supporterFee, authorFee ) {
  return {
      type: types.GENERATE_BLOCKS,
      data: {nodes, supporterFee, authorFee}
  }
}

export function generatePOSBlockByIndex(count, index, supporterFee, authorFee) {
    return (dispatch, getState)=>{
        const generators = getNodeOfType(getState(), NodeType.GENERATOR)
        dispatch(generatePOSBlock(count, generators.getIn([index, 'id']),supporterFee, authorFee))
    }
}

export function setCreateSimulationModalOpen(value) {
    return {
        type: types.SET_CREATE_SIMULATION_POPUP_OPEN,
        data: value
    }
}

export function setChartsModalOpen(value) {
    return {
        type: types.SET_CHARTS_POPUP_OPEN,
        data: value
    }
}

export function setChartsPopupIteration(iteration) {
    return {
        type: types.SET_CHARTS_POPUP_ITERATION,
        data: iteration
    }
}
