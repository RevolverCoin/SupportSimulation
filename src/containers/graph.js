import {connect} from 'react-redux';

import Graph from '../components/graph';



function prepareNodeData(nodes) {
    return nodes && nodes.toJS().map(({id, label, color})=>({
            id,
            label,
            color
        }))
}

function  mapStateToProps(state){
    return {
        nodes :prepareNodeData(state.get('nodes')),
        edges: state.get('edges').toJS()
    }
}

function mapDispatchToProps(dispatch){
    return {

    }
}

export default  connect(mapStateToProps, mapDispatchToProps)(Graph)

