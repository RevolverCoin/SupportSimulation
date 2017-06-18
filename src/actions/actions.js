import * as types from "../constants/ActionType";
import {getGenerators, getSupporters, INITIAL_STATE, getNodeOfType} from "../core/core";
import {Range} from 'immutable'
import * as NodeType from "../constants/NodeType";

import {dumpState,postProcess, dumpCSV} from '../core/statistics'

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

export function addStatistics(mag, dens) {
    return (dispatch, getState) => {
        dispatch({
            type: types.ADD_STATISTICS_RAW,
            data: {state:getState(), mag, dens}
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
 * sum of pGen + pAuth + pSup must be equal to 1
 * @returns {function(*=, *=)}
 */
export function createSimulation({magMin, magMax, magStep, densMin, densMax, densStep, supToGenActivity, pGen, pAuth, pSup},) {
    return (dispatch, getState) => {
        const magRange = Range(magMin, magMax, magStep);
        const densRange = Range(densMin, densMax, densStep)

        dispatch(clearStatistics())

        let round = 0;
        magRange.forEach(mag => {
            densRange.forEach(dens => {

                console.log(`Starting round ${++round} mag:${mag}, dens:${dens}`)
                const genCount = mag * pGen;
                const authCount = mag * pAuth;
                const supCount = mag * pSup;


                const avgGenSupport = 0.5 * dens * (mag - 1) / (pGen + supToGenActivity * pSup )
                const avgSupSupport = avgGenSupport * supToGenActivity

                dispatch(createGenerator(Math.floor(genCount)))
                dispatch(createAuthor(Math.floor(authCount)))
                dispatch(createSupporter(Math.floor(supCount)))


                dispatch(updateAuthorsSupportProb())
                dispatch(establishSupportFromGenerators({sMin: 0, sMax: 2 * avgGenSupport}))
                dispatch(establishSupportFromSupporters({sMin: 0, sMax: 2 * avgSupSupport}))

                const generators = getNodeOfType(getState(), NodeType.GENERATOR)

                generators.forEach(generator => {
                    dispatch(generatePOSBlock(1, generator.get('id')))
                })


                dispatch(addStatistics(mag, dens))
                console.log(`added statistics for round ${round}`)
                dispatch(resetState())
            })
        })


        dispatch(computeStatistics())

     //   console.log("Statistics:", dumpCSV(getState()))
        const postProcessedData = postProcess(getState().getIn(['statistics', 'processed']))


        console.log(postProcessedData)
        console.log(postProcessedData.avgAuthorsRewardList,dumpCSV(postProcessedData.avgAuthorsRewardList, postProcessedData.maxSupportCount))
       // console.log(dumpCSV(postProcessedData.avgGeneratorsRewardList))
       // console.log(dumpCSV(postProcessedData.avgSupportersRewardList))
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

export function establishSupportFromGenerators({sMinx = 1, sMax = 8}) {
    return (dispatch, getState) => {
        dispatch(establishSupport(getGenerators(getState()), sMinx, sMax, 1, 100))
    }
}

export function establishSupportFromSupporters({sMinx = 1, sMax = 6}) {
    return (dispatch, getState) => {
        dispatch(establishSupport(getSupporters(getState()), sMinx, sMax, 1, 100))
    }
}

export function generatePOSBlock(count = 1, nodeId) {
    return {
        type: types.GENERATE_POS_BLOCK,
        data: {count, nodeId}
    }
}