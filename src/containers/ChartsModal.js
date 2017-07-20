'use strict'

import React, {Component} from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {Range} from 'immutable'


import {setChartsModalOpen} from '../actions/actions'
import RewardChart from '../components/RewardChart'


function prepareD3Data(maxSupportCount, authorsReward, supportersReward, generatorsReward) {
    //create range object to iterate over the reward data to be sure output arrays all have equal number of points
    const range = Range(0, maxSupportCount)
    return [
        {
            "name": "Authors reward",
            "values": range.map(key => ([key, authorsReward.get(key)||0])).toJS(),
        },

        {
            "name": "Supporters reward",
            "values": range.map(key => ([key, supportersReward.get(key)||0])).toJS()
        },


        {
            "name": "Generators reward",
            "values": range.map(key => ([key, generatorsReward.get(key)||0])).toJS()
        }
    ];
}


function mapChartStateToProps(state) {
    const authorsRewardRaw = state.getIn(['statistics', 'processed', 0, 'avgAuthorsRewardList'])
    const supportersReward = state.getIn(['statistics', 'processed', 0, 'avgSupportersRewardList'])
    const generatorsReward = state.getIn(['statistics', 'processed', 0, 'avgGeneratorsRewardList'])


    const maxSupportCount = Math.max(
        authorsRewardRaw.keySeq().sort().last() || 0,
        supportersReward.keySeq().sort().last() || 0)


    const d3data = authorsRewardRaw && prepareD3Data(maxSupportCount, authorsRewardRaw, supportersReward,generatorsReward);
    console.log(d3data)
    return {
        isOpen: state.get('isChartsModalOpen'),
        reward: d3data
    }

}

const RewardChartContainer = connect(mapChartStateToProps)(RewardChart)


class ChartsModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {isOpen, onCancel} = this.props;
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
                <h2>Simulation results</h2>
                <RewardChartContainer/>
                <button onClick={onCancel}>OK</button>
            </Modal>
        )
    }
}


function mapStateToProps(state) {
    return {
        isOpen: state.get('isChartsModalOpen')
    }

}

function mapDispatchToProps(dispatch) {
    return {
        onClose(){
            dispatch(setChartsModalOpen(false));
        },

        onCancel(){
            dispatch(setChartsModalOpen(false))
        }
    }
}

export default  connect(mapStateToProps, mapDispatchToProps)(ChartsModal)