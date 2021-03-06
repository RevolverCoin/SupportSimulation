'use strict'

import React, {Component} from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';


import {setCreateSimulationModalOpen, createSimulation, restart, updateStructure} from '../actions/actions'


const DEFAULT_STATE = {
    magMin: 120,
    magMax: 123,
    magStep: 5,
    densMin: 0.2,
    densMax: 0.5,
    densStep: 0.3,
    supToGenActivity: 1,
    pGen: 0.3,
    pAuth: 0.2,
    pSup: 0.5,
    authorFee: 0.5,
    supporterFee: 0.1,
    sampleSize: 1
}

const Separator = () => <div className="separator"/>

class StartSimulationModal extends Component {

    constructor(props) {
        super(props)
        this.state = DEFAULT_STATE

        this._onStartSimulation = this._onStartSimulation.bind(this)
    }

    _handleChange(param, value) {
        this.setState({
            [param]: value,
        }, ()=>{
            const precision = 1000;
            const pGen = parseFloat(this.state.pGen)
            const pAuth = parseFloat(this.state.pAuth)
            const pSup = Math.round( precision*(1 - pGen - pAuth))/precision


            this.setState({
                densMax:  Math.round( precision*2 * pAuth * (pGen + pSup))/precision,
                pSup
            })
        })

    }

    _onStartSimulation() {
        const {onClose} = this.props;
        const {
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
            authorFee,
            supporterFee,
            sampleSize
        } = this.state;

        onClose && onClose({
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
            authorFee,
            supporterFee,
            sampleSize
        })

    }


    render() {
        const {isOpen, onCancel} = this.props;
        return (
            <Modal
                isOpen={isOpen}
                onAfterOpen={() => this.setState({...DEFAULT_STATE})}
                contentLabel="Modal"
                className={{
                    base: 'start-simulation-modal'
                }}
            >
                <h2>Simulation parameters</h2>
                <form onSubmit={this._onStartSimulation}>
                    <label>
                        <span>n_min (magMin):</span>
                        <input type="input" placeholder="magMin" value={this.state.magMin}
                               onChange={({target: {value}}) => this._handleChange("magMin", value)}/>
                    </label>

                    <label>
                        <span>n_max (magMax):</span>
                        <input type="input" placeholder="magMax" value={this.state.magMax}
                               onChange={({target: {value}}) => this._handleChange("magMax", value)}/>

                    </label>

                    <label>
                        <span>n step:</span>
                        <input type="input" placeholder="magStep" value={this.state.magStep}
                               onChange={({target: {value}}) => this._handleChange("magStep", value)}/>
                    </label>

                    <Separator/>

                    <label>
                        <span>γ1 (pGen):</span>
                        <input type="input" placeholder="pGen" value={this.state.pGen}
                               onChange={({target: {value}}) => this._handleChange("pGen", value)}/>

                    </label>


                    <label>
                        <span>γ2 (pAuth):</span>
                        <input type="input" placeholder="pAuth" value={this.state.pAuth}
                               onChange={({target: {value}}) => this._handleChange("pAuth", value)}/>

                    </label>


                    <label>
                        <span>γ3 (pSup):</span>
                        <input type="input" placeholder="pSup" value={this.state.pSup} disabled={true}
                               onChange={({target: {value}}) => this._handleChange("pSup", value)}/>
                    </label>


                    <label>
                        <span>δ (supToGenActivity):</span>
                        <input type="input" placeholder="supToGenActivity" value={this.state.supToGenActivity}
                               onChange={({target: {value}}) => this._handleChange("supToGenActivity", value)}/>
                    </label>

                    <Separator/>


                    <label>
                        <span>d_min (densMin):</span>
                        <input type="input" placeholder="densMin" value={this.state.densMin}
                               onChange={({target: {value}}) => this._handleChange("densMin", value)}/>

                    </label>


                    <label>
                        <span>d_max (densMax):</span>
                        <input type="input" placeholder="densMax" value={this.state.densMax} disabled={true}
                               onChange={({target: {value}}) => this._handleChange("densMax", value)}/>
                    </label>


                    <label>
                        <span>densStep:</span>
                        <input type="input" placeholder="densStep" value={this.state.densStep}
                               onChange={({target: {value}}) => this._handleChange("densStep", value)}/>
                    </label>

                    <Separator/>

                    <label>
                        <span>Author fee (α1):</span>
                        <input type="input" placeholder="Author fee" value={this.state.authorFee}
                               onChange={({target: {value}}) => this._handleChange("authorFee", value)}/>
                    </label>

                    <label>
                        <span>Supporter fee (α2):</span>
                        <input type="input" placeholder="Supporter fee" value={this.state.supporterFee}
                               onChange={({target: {value}}) => this._handleChange("supporterFee", value)}/>
                    </label>

                    <Separator/>
                    <Separator/>

                    <label>
                        <span>Sample count:</span>
                        <input type="input" placeholder="Sample count" value={this.state.sampleSize}
                               onChange={({target: {value}}) => this._handleChange("sampleSize", value)}/>
                    </label>

                    <input type="submit" value="Start simulation"/>
                </form>

                <button onClick={onCancel}>Cancel</button>
            </Modal>
        )
    }
}


function mapStateToProps(state) {
    return {
        isOpen: state.get('isCreateSimulationModalOpen')
    }

}

function mapDispatchToProps(dispatch) {
    return {
        onClose(params) {
            dispatch(setCreateSimulationModalOpen(false))
            dispatch(restart());
            dispatch(createSimulation(params));
        },

        onCancel() {
            dispatch(setCreateSimulationModalOpen(false))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StartSimulationModal)
