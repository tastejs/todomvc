export function willGet() {
  return { type: 'getting' }
}

export function didGet(todos) {
  if(Array.isArray(todos)) {
    return { type: 'got', todos: todos, isOk: true }
  } else {
    return { type: 'got', isFailed: true }
  }
}

export function willPut() {
  return { type: 'putting' }
}

export function didPut(successful) {
  if(successful) {
    return { type: 'put', isOk: true }
  } else {
    return { type: 'put', isFailed: true }
  }
}
