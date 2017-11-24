import * as React from "react";
import * as ReactDOM from "react-dom";
import * as redux from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import thunkMiddleware from "redux-thunk";

import combinedReducers from "./store/reducers";

import { App } from "./app";

import "./styles/globals/main.global.css";

const store = redux.createStore(combinedReducers, redux.applyMiddleware(thunkMiddleware));

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
), document.getElementById("app"))