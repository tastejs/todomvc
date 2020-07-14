import m from "mithril"
import { model } from "./model"
import Routes from "./routes"

const root = document.getElementById("todomvc")

let mdl = localStorage.getItem("todos-mithril")
  ? JSON.parse(localStorage.getItem("todos-mithril"))
  : model

m.route.prefix = ""

m.route(root, "/", Routes(mdl))
