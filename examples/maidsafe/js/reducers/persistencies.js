const initialState = { inFlight: false }

export default function persistencies(state = initialState, action) {
  switch (action.type) {
    case 'putting':
      return { inFlight: true }
    case 'put':
      return { inFlight: false, isOk: action.isOk, isFailed: action.isFailed }
    case 'getting':
      return { inFlight: true }
    case 'got':
      return { inFlight: false, isOk: action.isOk, isFailed: action.isFailed, todos: action.todos }
    default:
      return state
  }
}
