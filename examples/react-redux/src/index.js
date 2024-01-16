import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { HashRouter, Route } from "react-router-dom";
import App from "./app";
import reducer from "./reducers";
import "todomvc-app-css/index.css";

const store = createStore(reducer);

render(
    <Provider store={store}>
        <HashRouter>
            <Route path="*" component={App} />
        </HashRouter>
    </Provider>,
    document.getElementById("root")
);
