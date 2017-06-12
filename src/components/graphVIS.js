
import React,{Component} from 'react';

import Graph from 'react-graph-vis'


let options = {

    autoResize: true,

    layout: {
        hierarchical: false,
        randomSeed: 0
    },
    edges: {
        color: "#999999"
    },

    interaction:{
        hover:true,
        hoverConnectedEdges: true,
    },

    physics:{
        timestep:20,
        maxVelocity:1,

        //stabilization: false,

         stabilization:{
             iterations:100,
             fit: false
         },


        barnesHut : {
            gravitationalConstant: -20000,
            centralGravity: 1,
            springLength:260,
            springConstant: 0.01,
            damping: 0.09,
            avoidOverlap:0
        }

    },

};


let optionsStabilized = {

    "physics": {
    //     "barnesHut": {
    //         "gravitationalConstant": -10750,
    //         "centralGravity": 0.45
    //     },
    //     "maxVelocity": 166,
    //     "minVelocity": 100,
    //     "timestep": 0.5,
    //
    //     stabilization:{
    //
    //         iterations:1,
    //         fit: true
    //     },
        enabled: false,
        repulsion: {
            centralGravity: 0.2,
            springLength: 200,
            springConstant: 0.05,
            nodeDistance: 200,
            damping: 0.09
        },
        solver: 'repulsion',
        // stabilization:
        // {
        //     iterations: 500,
        // }
    },
    layout: {
        //randomSeed: 0
    },
};




class GraphImpl extends Component{

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            options: optionsStabilized,

        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        this.props.parent.setGraphImpl(this);

        console.log("Update: " + Math.random());
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions.bind(this));

        this.stabilize();

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions.bind(this));

    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });

    }

    stabilize()
    {
        // this.graph.Network.setOptions( options );
        // // stabilize with 200 iterations
        // this.graph.Network.stabilize(200);
        // this.graph.Network.on("stabilizationIterationsDone", (params)=>{
        //     this.graph.Network.setOptions( optionsStabilized );
        //  });
    }
    // componentDidUpdate() {
    //
    //     this.stabilize()
    //
    // }


    render() {

        const {nodes, edges} = this.props;

        const styleObj = {
            width: this.state.width + "px",
            height: this.state.height + "px",
        };

        return (
            <Graph ref={ref=>this.graph=ref} graph={{nodes, edges}} options={optionsStabilized} style={styleObj}/>
        )
    }
}

export default GraphImpl;
