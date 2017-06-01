import * as authorizations from '../actions/authorizations'
import * as persistencies from '../actions/persistencies'
import * as http from './http'


export function getNetworkCredentials() {
  const token = window.localStorage.token
  const key   = new Uint8Array(new Buffer(window.localStorage.symmetricKey, 'base64'))
  const nonce = new Uint8Array(new Buffer(window.localStorage.symmetricNonce, 'base64'))

  return { token, key, nonce }
}

export function authorizeApplicationOrConfirmObtainedToken(store) {
  store.dispatch(authorizations.willAuthorize())

  const token = window.localStorage.token
  let action = (token ? asyncGetAuth(token) : asyncPostAuth())
  return store.dispatch(action)
}

export function asyncGetAuth(token) {
  return function(dispatch) {
    return http.getAuth(token)
      .then((response) => {
          if(response.status == 200) {
            return dispatch(authorizations.didAuthorized(true))
          }
          if(response.status == 401) {
            return dispatch(asyncPostAuth())
          }
      })
      .catch((reason) => {
        console.debug('asyncGetAuth failed')
        return dispatch(authorizations.didAuthorized(undefined))
      })
  }
}

export function asyncPostAuth() {
  return function(dispatch) {
    return http.postAuth()
      .then((response) => {
        if(response.status == 200) {
          window.localStorage.token = response.__parsedResponseBody__.token
          window.localStorage.publicKey = response.__parsedResponseBody__.publicKey
          window.localStorage.encryptedKey = response.__parsedResponseBody__.encryptedKey

          window.localStorage.symmetricKey = response.__parsedResponseBody__.symmetricKeys.key
          window.localStorage.symmetricNonce = response.__parsedResponseBody__.symmetricKeys.nonce

          return dispatch(authorizations.didAuthorized(true))
        }
        if(response.status == 401) {
          return dispatch(authorizations.didAuthorized(false))
        }
      })
      .catch((reason) => {
        console.debug('asyncPostAuth failed')
        return dispatch(authorizations.didAuthorized(undefined))
      })
  }
}

export function getTodosFileOrPutInitialFromApplicationState(store) {
  // http.deleteFile(window.localStorage.token)
  store.dispatch(asyncGetFile())
}

export function asyncGetFile() {
  return function(dispatch) {
    dispatch(persistencies.willGet())

    const { token, key, nonce } = getNetworkCredentials()
    return http.getFile(token, key, nonce).then((response) => {

      if(response.status == 200) {
        const todos = response.__parsedResponseBody__
        return dispatch(persistencies.didGet(todos))
      }

      if(response.status == 400) {
        dispatch(persistencies.didGet(undefined))
        return http.postFile(token, key, nonce)
          .then((response) => {
            if(response.status == 200) {
              return dispatch(asyncPutFile()).then(() => dispatch(asyncGetFile()))
            }
          })
      }
    })
  }
}

export function asyncPutFile() {
  return function(dispatch, getState) {
    dispatch(persistencies.willPut())
    const { token, key, nonce } = getNetworkCredentials()
    const payload = getState().todos

    return http.putFile(token, key, nonce, payload)
      .then((response) => {
        if(response.status == 200) {
          return dispatch(persistencies.didPut(true))
        }
      })
  }
}

export function asyncPostAuthAndGetFile() {
  return function(dispatch) {
    return dispatch(asyncPostAuth())
      .then(() => { return dispatch(asyncGetFile()) })
  }
}
