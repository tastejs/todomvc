"use strict"

###
Services that persists and retrieves TODOs from localStorage.
###
window.todomvc.factory "todoStorage", ->
  STORAGE_ID = "todos-angularjs-perf"
  get: ->
    JSON.parse localStorage.getItem(STORAGE_ID) or "[]"

  put: (todos) ->
    localStorage.setItem STORAGE_ID, JSON.stringify(todos)

