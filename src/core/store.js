import {createStore, applyMiddleware} from "redux";
import reducer from "../reducers/reducer";
import { composeWithDevTools } from 'remote-redux-devtools';
import thunk from 'redux-thunk'

export default function configureStore(initialState) {
    const store = createStore(reducer, initialState, composeWithDevTools(
        applyMiddleware(thunk),
        // other store enhancers if any
      ));
    return store;
}

