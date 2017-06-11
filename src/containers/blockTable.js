import {connect} from 'react-redux';

import blocksTable from '../components/blocksTable';


function mapStateToProps(state) {
    return {
        data: state.get('blocks').map(b => ({id: b.get('finderId')})),
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default  connect(mapStateToProps, mapDispatchToProps)(blocksTable)

