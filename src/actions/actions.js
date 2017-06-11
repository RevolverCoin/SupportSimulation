import * as types from "../constants/ActionType";
import {getGenerators, getSupporters, INITIAL_STATE, getNodeOfType} from "../core/core";
import {Range} from 'immutable'
import * as NodeType from "../constants/NodeType";

import {dumpState} from '../core/statistics'

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

export function addStatistics() {
    return (dispatch, getState) => {
        dispatch({
            type: types.ADD_STATISTICS_RAW,
            data: getState()
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

export function createSimulation({magMin, magMax, magStep, densMin, densMax, densStep, numBlocks}) {
    return (dispatch, getState) => {
        const magRange = Range(magMin, magMax, magStep);
        const densRange = Range(densMin, densMax, densStep)

        dispatch(clearStatistics())

        let round = 0;
        magRange.forEach(mag => {
            densRange.forEach(dens => {

                console.log(`Starting round ${++round} mag:${mag}, dens:${dens}`)
                const genCount = mag / 3;
                const authCount = mag / 3;
                const supCount = mag / 3;


                dispatch(createGenerator(genCount))
                dispatch(createAuthor(authCount))
                dispatch(createSupporter(supCount))


                dispatch(updateAuthorsSupportProb())
                dispatch(establishSupportFromGenerators())
                dispatch(establishSupportFromSupporters())

                const generators = getNodeOfType(getState(), NodeType.GENERATOR)

                generators.forEach(generator => {
                    dispatch(generatePOSBlock(1, generator.get('id')))
                })


                dispatch(addStatistics())
                console.log(`added statistics for round ${round}`)
                dispatch(resetState())
            })
        })


        dispatch(computeStatistics())
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

export function establishSupportFromGenerators() {
    return (dispatch, getState) => {
        dispatch(establishSupport(getGenerators(getState()), 1, 8, 1, 100))
    }
}

export function establishSupportFromSupporters() {
    return (dispatch, getState) => {
        dispatch(establishSupport(getSupporters(getState()), 1, 6, 1, 100))
    }
}

export function generatePOSBlock(count = 1, nodeId) {
    return {
        type: types.GENERATE_POS_BLOCK,
        data: {count, nodeId}
    }
}