'use strict'

import React, {Component} from 'react';
import Modal from 'react-modal';
import Dropdown from 'react-dropdown'
import {connect} from 'react-redux';
import {Range} from 'immutable'


import {setChartsModalOpen, setChartsPopupIteration, setChartsDataModalOpen, setStatisticsChartData} from '../actions/actions'
import RewardChart from '../components/RewardChart'

function prepareD3Data(maxSupportCount, reward, multiplier = 1) {
    //create range object to iterate over the reward data to be sure output arrays all have equal number of points
    const range = Range(0, maxSupportCount + 1)
    return {
        name:"reward",
        values:reward.keySeq().sort().map(key => ([key, reward.get(key)  * multiplier|| 0])).toJS()
    }

}


function createDataArray(existingData, maxSupportCount, reward, multiplier = 1) {
    return existingData ? {name:'reward', values : existingData} : prepareD3Data(maxSupportCount, reward, multiplier)
}


function mapChartStateToProps(state) {
    const iteration = state.get('chartsModalIteration') || 0;
    const authorsRewardRaw = state.getIn(['statistics', 'processed', iteration, 'avgAuthorsRewardList'])
    const supportersReward = state.getIn(['statistics', 'processed', iteration, 'avgSupportersRewardList'])
    const generatorsReward = state.getIn(['statistics', 'processed', iteration, 'avgGeneratorsRewardList'])
    const authorsDegreeRaw = state.getIn(['statistics', 'processed', iteration, 'authorNodesDegree'])
    const authorRewardDistr = state.getIn(['statistics', 'processed', iteration, 'authorRewardDistr'])

    const generatorsChart = state.getIn(['charts','generators'])
    const supportersChart = state.getIn(['charts','supporters'])
    const authorsChart = state.getIn(['charts','authors'])

    const maxSupportCount = Math.max(
        authorsRewardRaw.keySeq().sort().last() || 0,
        supportersReward.keySeq().sort().last() || 0)

    return {
        isOpen: !!state.get('isChartsModalOpen'),
        generators:  [
            createDataArray(generatorsChart, maxSupportCount, generatorsReward, 100)
        ],
        supporters: [
            createDataArray(supportersChart,maxSupportCount, supportersReward, 100),
        ],
        authors:[
            createDataArray(authorsChart,maxSupportCount, authorsRewardRaw, 100)
        ],

        authorDegrees : [
            prepareD3Data(maxSupportCount, authorsDegreeRaw)
        ],


        authorRewardDistr : [
            prepareD3Data(authorRewardDistr.size, authorRewardDistr)
        ]
    }

}

function mapChartDispatchToProps(dispatch) {
    return {
        showData(chartId, data) {
            dispatch(setChartsDataModalOpen(chartId))
            dispatch(setStatisticsChartData(chartId, data))
        }
    }
}

const RewardChartContainer = connect(mapChartStateToProps, mapChartDispatchToProps)(RewardChart)


class ChartsModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {isOpen, data, onCancel, iterations, iteration, setChartsPopupIteration} = this.props;

        if (!isOpen || !data) return null;

        const currentIteration = data.get(iteration);
        const pGen = currentIteration.get('pGen')
        const pAuth =currentIteration.get('pAuth')
        const pSup = 1 - pGen - pAuth


        const iterationDesc = data && currentIteration ? `${iteration.toString()} (nodes : ${currentIteration.get('mag')}, density : ${currentIteration.get('dens')}, samples:${currentIteration.get('sampleSize')})` : 'no iteration data'

        return (
            <Modal
                isOpen={isOpen}
                onAfterOpen={() => {
                }}
                contentLabel="Modal"
                className={{
                    base: 'charts-modal'
                }}
            >
                <div>    
                    <h2>Simulation results</h2>
                    <p>Select iteration</p>
                    <Dropdown options={iterations} value={iterationDesc} onChange={setChartsPopupIteration}
                            placeholder="Select iteration"/>
                    <div>
                        <ul>
                            <li>n : {currentIteration.get('mag')}</li>
                            <li>γ1(pGen) : {pGen}</li>
                            <li>γ2(pAuth) : {pAuth}</li>
                            <li>γ3(pSup) : {pSup}</li>

                            <li>Real avg density : {currentIteration.get('realDensity')}</li>

                            <li>authors reward : {100*currentIteration.get('authorsReward')}%</li>
                            <li>supporters reward : {100*currentIteration.get('supportersReward')}%</li>
                            <li>generators reward : {100*currentIteration.get('generatorsReward')}%</li>
                            <li>activity : {currentIteration.get('supToGenActivity')}%</li>

                        </ul>
                    </div>
                    <RewardChartContainer/>
                    <button onClick={onCancel}>OK</button>
                </div>    
            </Modal>
        )
    }
}


function mapStateToProps(state) {
    const processed = state.getIn(['statistics', 'processed'])
    const iterations = processed && Range(0, processed.size).toJS()
    return {
        isOpen: state.get('isChartsModalOpen'),
        data: state.getIn(['statistics', 'processed']),
        iterations,
        iteration: (state.get('chartsModalIteration') || 0)
    }

}

function mapDispatchToProps(dispatch) {
    return {
        onClose() {
            dispatch(setChartsModalOpen(false));
        },

        onCancel() {
            dispatch(setChartsModalOpen(false))
        },

        setChartsPopupIteration(iteration) {
            if (iteration) {
                dispatch(setChartsPopupIteration(parseInt(iteration.value)))
            }

        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartsModal)