"use strict"

;; import active logoses
(include "metajs/src/logos/javascript.mjs")
(include "metajs/src/logos/browser.mjs")
(include "metajs/src/logos/metajs.mjs")
(include "./logos/angular.mjs")

(def todomvc (angular.module "todomvc" []))

(include "./angular_utils")
(include "./services/todo_storage")
(include "./directives/todo_escape")
(include "./directives/todo_focus")
(include "./controllers/todo_ctrl")

