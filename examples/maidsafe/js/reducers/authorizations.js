const initialState = { inFlight: false, isAuthorized: false }

export default function authorizations(state = initialState, action) {
  switch (action.type) {
    case 'authorizing':
      return { inFlight: true, isAuthorized: false }
    case 'authorized':
      return { inFlight: false, isAuthorized: action.isAuthorized }
    default:
      return state
  }
}
