import { h, render } from "preact";
import App from "./app/app";

import "todomvc-app-css/index.css";
import "todomvc-common/base.css";
import "./styles.css";

render(<App />, document.querySelector(".todoapp"));
