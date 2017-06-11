import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "remote-redux-devtools";
import reducer from "../reducers/reducer";
import thunk from 'redux-thunk'
const composeEnhancers = composeWithDevTools({ realtime: true, port: 8000 });



export default function configureStore(initialState) {

    const composeEnhancers = composeWithDevTools({ realtime: true });
    const store = createStore(reducer, initialState, composeEnhancers(
        applyMiddleware(thunk)
    ));

    // if (module.hot) {
    //     // Enable Webpack hot module replacement for reducers
    //     module.hot.accept('../reducers', () => {
    //         const nextReducer = require('../reducers').default;
    //         store.replaceReducer(nextReducer);
    //     });
    // }

    return store;
}

