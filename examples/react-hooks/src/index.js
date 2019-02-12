import "core-js/es6/map";
import "core-js/es6/set";
import "raf/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App/App";
import * as serviceWorker from "./serviceWorker";

const root = document.getElementById("root");
ReactDOM.render(<App />, root);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
