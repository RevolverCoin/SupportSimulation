import {createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "remote-redux-devtools";
import reducer from "../reducers/reducer";
import thunk from 'redux-thunk'

export default function configureStore(initialState) {

    const composeEnhancers = composeWithDevTools({ realtime: true });
    const store = createStore(reducer, initialState, composeEnhancers(
        applyMiddleware(thunk)
    ));
    return store;
}

