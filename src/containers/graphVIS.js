import {connect} from 'react-redux';

import Graph from '../components/graphVIS';





function prepareNodeData(nodes) {
    return nodes && nodes.toJS().map(({id, label, color})=>({
            id,
            label,
            color
        }))
}

function prepareEdgesData(nodes) {
    return nodes && nodes.toJS().map(({id, source, target, arrows})=>({
            id,
            from:source,
            to:target,
            arrows,
            color: 'rgb(200,200,200)'
        }))
}

function  mapStateToProps(state){
    return {
        nodes :state.get('nodes').toJS(),
        edges: prepareEdgesData(state.get('edges'))
        //nodes,
        //edges
    }
}

function mapDispatchToProps(dispatch){
    return {

    }
}

export default  connect(mapStateToProps, mapDispatchToProps)(Graph)

