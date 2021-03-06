import React, {Component} from "react";
import {Provider} from "react-redux";
import {fromJS} from "immutable";

import {graph1} from './data/data'

import "./App.css";
import Graph from "./containers/graphVIS";
import StartSimulationModal from "./containers/StartSimulationModal";
import ChartsModal from "./containers/ChartsModal";
import ChartsDataModal from "./containers/ChartsDataModal";
import configureStore from "./core/store";


import {
    createAuthor,
    createSupporter,
    createGenerator,
    generatePOSBlock,
    generatePOSBlockByIndex,
    establishSupportFromGenerators,
    establishSupportFromSupporters,
    updateAuthorsSupportProb,
    updatePOSBlockProbs,
    updateStructure,
    setChartsModalOpen,
    restart,
    setCreateSimulationModalOpen
} from "./actions/actions";

const initialGraph = null;

let store;
if (!initialGraph) {
    store = configureStore()
}
else {
    store = configureStore(initialGraph)
}

class App extends Component {


    constructor(props) {
        super(props);
        this.onGenBlock = this.onGenBlock.bind(this);
        this.onLaunchSimulation = this.onLaunchSimulation.bind(this);
        this.onBuildGraph = this.onBuildGraph.bind(this);
        this.onShowCharts = this.onShowCharts.bind(this);
        this.onRunPOS = this.onRunPOS.bind(this);

        this.currenGenIndex = 0;

        this.state = {
            graphKey: 0,
            isPOSLaunched: false,
            isFirstLaunch: true,
            blockId: 0,
        }
    }

    onGenBlock() {
        store.dispatch(generatePOSBlockByIndex(1, this.currenGenIndex++, 0.1,0.5));
        store.dispatch(updateStructure());

        this.setState({blockId: this.state.blockId + 1});
    }
    onShowCharts(){
        if (store.getState().get('statistics')){
            store.dispatch(setChartsModalOpen(true))
        }
        else{
            alert('No simulation data available')
        }
    }

    onLaunchSimulation() {
        store.dispatch(restart());
        store.dispatch(setCreateSimulationModalOpen(true))
    }

    onBuildGraph() {
        store.dispatch(restart());

        store.dispatch(createAuthor(50))
        store.dispatch(createGenerator(30))
        store.dispatch(createSupporter(100))


        store.dispatch(updateAuthorsSupportProb())
        store.dispatch(establishSupportFromGenerators({sMinx: 1, sMax: 8}))
        store.dispatch(establishSupportFromSupporters({sMinx: 1, sMax: 6}))


        store.dispatch(updatePOSBlockProbs())

        store.dispatch(updateStructure());

        this.setState({
            graphKey: this.state.graphKey + 1
        });


    }

    setGraphImpl(impl) {
        this.graphImpl = impl;
    }

    launchPOS(inst) {
        if (inst.state.isPOSLaunched) {
            inst.onGenBlock();

            setTimeout(inst.launchPOS, 1, inst)
        }
    }

    onRunPOS() {
        if (this.state.isPOSLaunched) {
            this.setState({isPOSLaunched: false});
            return;
        } else {

            if (this.state.isFirstLaunch) {
                this.onBuildGraph();
            }

            this.setState({isPOSLaunched: true, isFirstLaunch: false});
        }

        setTimeout(this.launchPOS, 100, this);
    }

    render() {

        const btnPOSCaption = (this.state.isPOSLaunched ? 'POS Pause...' : 'Run POS');

        const blocks = store && store.getState() ? store.getState().get('blocks') : null;
        const id = blocks && blocks.last() ? blocks.last().get('finderId') : 0;

        return (
            <Provider store={store}>
                <div className="App">


                    <div className="graph-container">
                        <Graph parent={this} ref={ref => this.graph = ref} key={this.state.graphKey}/>
                    </div>

                    <div className="control-block">
                        <h3>XRE Simulation Launchpad</h3>

                        <button onClick={this.onGenBlock}>
                            Generate block
                        </button>

                        <button onClick={this.onBuildGraph}>
                            Build graph
                        </button>

                        <button onClick={this.onRunPOS}>
                            {btnPOSCaption}
                        </button>

                        <button onClick={this.onLaunchSimulation}>
                            Launch Sim
                        </button>

                        <button onClick={this.onShowCharts}>
                            Show charts
                        </button>

                        <div className="legend">
                            <p>Block #: {this.state.blockId}</p>
                            <p>Total reward: {this.state.blockId * 10} </p>
                            <p>Winner: {id} </p>

                        </div>

                        <StartSimulationModal/>
                        <ChartsModal/>
                        <ChartsDataModal/>

                    </div>

                </div>
            </Provider>
        );
    }
}

export default App;
