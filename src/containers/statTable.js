import {connect} from 'react-redux';
import {fromJS} from 'immutable'
var json2csv = require('json2csv');


import Table from '../components/statTable';
import {getAdjacentNodes, createAdjacencyMatrix} from '../core/utils';

function dump(data) {
    const fields = ['id', 'reward','blockReward','edgeCount','type'];

    try {
        const result = json2csv({ data, fields });
        console.log(result);
    } catch (err) {
        // Errors are thrown for bad options, or if the data is empty and no fields are provided.
        // Be sure to provide fields if it is possible that your data array will be empty.
        console.error(err);
    }
}

function createStatistics(nodes, edges, blocks) {
    const matrix = createAdjacencyMatrix(edges)
    return nodes && nodes


            .map(node => {
                const nodeId = node.get('id')

                const blockReward = blocks.reduce((acc, next) => {
                    if (next.get('finderId') === nodeId) {
                        return acc + next.get('blockReward')
                    }

                    return acc
                }, 0)

                return fromJS({
                    id: node.get('label'),
                    blockReward,
                    type:node.get('type'),
                    reward: node.get('reward') || 0,
                    edgeCount: getAdjacentNodes(node.get('id'), matrix).size
                })
            })
            .sortBy(n => -n.get('reward'))
            .toJS()
}


function mapStateToProps(state) {
    const data = createStatistics(state.get('nodes'), state.get('edges'), state.get('blocks'));
    dump(data)
    return {
        data
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default  connect(mapStateToProps, mapDispatchToProps)(Table)

