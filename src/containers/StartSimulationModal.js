'use strict'

import React, {Component} from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';


import {setCreateSimulationModalOpen, createSimulation, restart} from '../actions/actions'

const DEFAULT_STATE = {
    magMin: 45,
    magMax: 50,
    magStep: 5,
    densMin: 0.2,
    densMax: 0.3,
    densStep: 0.1,
    supToGenActivity: 1,
    pGen: 0.3,
    pAuth: 0.2,
    pSup: 0.5,
    authorFee : 0.7,
    supporterFee : 0.05
}

class StartSimulationModal extends Component {

    constructor(props) {
        super(props)
        this.state = DEFAULT_STATE

        this._onStartSimulation = this._onStartSimulation.bind(this)
    }

    _handleChange(param, value) {
        this.setState({
            [param]:parseFloat(value)
        })

        console.log(this.state)
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
            supporterFee
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
            supporterFee
        })

    }


    render() {
        const {isOpen, onCancel} = this.props;
        return (
            <Modal
                isOpen={isOpen}
                onAfterOpen={()=>this.setState({...DEFAULT_STATE})}
                contentLabel="Modal"
                className={{
                    base: 'start-simulation-modal'
                }}
            >
                <h2>Simulation parameters</h2>
                <form onSubmit={this._onStartSimulation}>
                    <label>
                        <span>magMin:</span>
                        <input type="input" placeholder="magMin" value={this.state.magMin}
                               onChange={({target:{value}}) => this._handleChange("magMin", value)}/>
                    </label>

                    <label>
                        <span>magMax:</span>
                        <input type="input" placeholder="magMax" value={this.state.magMax}
                               onChange={({target:{value}}) => this._handleChange("magMax", value)}/>

                    </label>


                    <label>
                        <span>magStep:</span>
                        <input type="input" placeholder="magStep" value={this.state.magStep}
                               onChange={({target:{value}}) => this._handleChange("magStep", value)}/>
                    </label>


                    <label>
                        <span>densMin:</span>
                        <input type="input" placeholder="densMin" value={this.state.densMin}
                               onChange={({target:{value}}) => this._handleChange("densMin", value)}/>

                    </label>


                    <label>
                        <span>densMax:</span>
                        <input type="input" placeholder="densMax" value={this.state.densMax}
                               onChange={({target:{value}}) => this._handleChange("densMax", value)}/>
                    </label>


                    <label>
                        <span>densStep:</span>
                        <input type="input" placeholder="densStep" value={this.state.densStep}
                               onChange={({target:{value}}) => this._handleChange("densStep", value)}/>
                    </label>


                    <label>
                        <span>supToGenActivity:</span>
                        <input type="input" placeholder="supToGenActivity" value={this.state.supToGenActivity}
                               onChange={({target:{value}}) => this._handleChange("supToGenActivity", value)}/>
                    </label>


                    <label>
                        <span>pGen:</span>
                        <input type="input" placeholder="pGen" value={this.state.pGen}
                               onChange={({target:{value}}) => this._handleChange("pGen", value)}/>

                    </label>


                    <label>
                        <span>pAuth:</span>
                        <input type="input" placeholder="pAuth" value={this.state.pAuth}
                               onChange={({target:{value}}) => this._handleChange("pAuth", value)}/>

                    </label>


                    <label>
                        <span>pSup:</span>
                        <input type="input" placeholder="pSup" value={this.state.pSup}
                               onChange={({target:{value}}) => this._handleChange("pSup", value)}/>
                    </label>

                    <label>
                        <span>Author fee:</span>
                        <input type="input" placeholder="Author fee" value={this.state.authorFee}
                               onChange={({target:{value}}) => this._handleChange("authorFee", value)}/>
                    </label>

                    <label>
                        <span>Supporter fee:</span>
                        <input type="input" placeholder="Supporter fee" value={this.state.supporterFee}
                               onChange={({target:{value}}) => this._handleChange("supporterFee", value)}/>
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
        onClose(params){
            dispatch(setCreateSimulationModalOpen(false))
            dispatch(restart());
            dispatch(createSimulation(params));
        },

        onCancel(){
            dispatch(setCreateSimulationModalOpen(false))
        }
    }
}

export default  connect(mapStateToProps, mapDispatchToProps)(StartSimulationModal)