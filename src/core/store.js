import {createStore, applyMiddleware} from "redux";
import reducer from "../reducers/reducer";
import thunk from 'redux-thunk'

export default function configureStore(initialState) {
    return createStore(reducer, initialState,  applyMiddleware(thunk));
}

