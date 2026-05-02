import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

import App from "./app";
import { store } from "./store";

import "todomvc-app-css/index.css";
import "todomvc-common/base.css";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>
);
