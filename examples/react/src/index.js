import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, hashHistory} from "react-router";
import App from "./app";
import "todomvc-app-css/index.css";

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/(:showing)" component={App}/>
	</Router>
	, document.getElementById('root'))
