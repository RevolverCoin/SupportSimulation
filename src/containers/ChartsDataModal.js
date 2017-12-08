'use strict'

import React, {Component} from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';


import {setChartsDataModalOpen, setStatisticsChartData} from '../actions/actions'


const Separator = () => <div className="separator"/>

class ChartsDataModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            chartData : this.props.data
        }

        this._onSave = this._onSave.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps;
        if (data) {
            this.setState({ chartData:data})
        }
    }

    _onSave() {
        const {onSave, chartId} = this.props;
        onSave && onSave(chartId, this.state.chartData)
    }


    render() {
        const { isOpen, onCancel, chartId } = this.props;
        return (
            <Modal
                isOpen={isOpen}
                contentLabel="Modal"
                className={{
                    base: 'charts-data-modal'
                }}
            >
                <h2>{`Chart data for ${chartId}`}</h2>
                <form onSubmit={this._onSave}>
                    <textarea type="input" placeholder="chart data" value={this.state.chartData}
                               onChange={({target: {value}}) =>this.setState({chartData:value})}/>
                    <input type="submit" value="Save"/>
                </form>

                <button onClick={onCancel}>Cancel</button>
            </Modal>
        )
    }
}


function mapStateToProps(state) {
    const chartId = state.get('isChartsDataModalOpen')

    return {
        isOpen: !!chartId,
        chartId,
        data : chartId && JSON.stringify(state.getIn(['charts',chartId]))
    }

}

function mapDispatchToProps(dispatch) {
    return {
        onSave(chartId, data) {
            dispatch(setChartsDataModalOpen(false))
            dispatch(setStatisticsChartData(chartId, JSON.parse(data)))
        },

        onCancel() {
            dispatch(setChartsDataModalOpen(false))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartsDataModal)
