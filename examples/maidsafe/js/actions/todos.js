import * as types from '../constants/ActionTypes'
import * as gatewayLogic from '../gateway/logic'

export function saveTodos() {
  return gatewayLogic.asyncPutFile()
}

export function loadTodos() {
  return gatewayLogic.asyncGetFile()
}

export function authorizeApp() {
  return gatewayLogic.asyncPostAuthAndGetFile()
}

export function addTodo(text) {
  return { type: types.ADD_TODO, text }
}

export function deleteTodo(id) {
  return { type: types.DELETE_TODO, id }
}

export function editTodo(id, text) {
  return { type: types.EDIT_TODO, id, text }
}

export function completeTodo(id) {
  return { type: types.COMPLETE_TODO, id }
}

export function completeAll() {
  return { type: types.COMPLETE_ALL }
}

export function clearCompleted() {
  return { type: types.CLEAR_COMPLETED }
}
