import meta from '../../package.json'

export function app() {
  return {
    name: meta.description, version: meta.version, vendor: meta.author, id: meta.name
  }
}


import * as libsodium from 'libsodium-wrappers'


export function fulfillPostAuth(assymetricKeys, assymetricNonce) {
  return function(response) {
    if(response.status == 200) {
      const cipher = new Uint8Array(new Buffer(response.__parsedResponseBody__.encryptedKey, 'base64'))
      const publicKey = new Uint8Array(new Buffer(response.__parsedResponseBody__.publicKey, 'base64'))
      const data = libsodium.crypto_box_open_easy(cipher, assymetricNonce, publicKey, assymetricKeys.privateKey)

      response.__parsedResponseBody__.symmetricKeys = {
        key: new Buffer(data.slice(0, libsodium.crypto_secretbox_KEYBYTES)).toString('base64'),
        nonce: new Buffer(data.slice(libsodium.crypto_secretbox_KEYBYTES)).toString('base64')
      }
    }
    return response
  }
}

export function postAuth(onFulfilled = fulfillPostAuth) {
  const assymetricKeys = libsodium.crypto_box_keypair()
  const assymetricNonce = libsodium.randombytes_buf(libsodium.crypto_box_NONCEBYTES)

  const payload = {
    app: app(),
    publicKey: new Buffer(assymetricKeys.publicKey).toString('base64'),
    nonce: new Buffer(assymetricNonce).toString('base64'),
    permissions: []
  }

  const init = {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store'
  }

  return fetch('http://localhost:8100/auth', init)
    .then((response) => {
      let parsedResponse
      if(response.status == 200) {
        parsedResponse = response.json()
          .then((json) => {
            response.__parsedResponseBody__ = json
            return response
          })
      }
      return (parsedResponse || response)
    })
    .then(onFulfilled(assymetricKeys, assymetricNonce))
}

export function getAuth(token) {
  const init = {
    method: 'GET',
    headers: { 'Authorization':'Bearer ' + token },
    cache: 'no-store'
  }

  return fetch('http://localhost:8100/auth', init)
}

export function deleteAuth(token) {
  const init = {
    method: 'DELETE',
    headers: { 'Authorization':'Bearer ' + token }
  }

  return fetch('http://localhost:8100/auth', init)
}

export function fulfillGetFile(symmetricKey, symmetricNonce) {
  return function(response) {
    let parsedResponse
    if(response.status == 200) {
      parsedResponse = response.text()
        .then((text) => {
          const body = new Buffer(text, 'base64')
          const data = libsodium.crypto_secretbox_open_easy(new Uint8Array(body), symmetricNonce, symmetricKey)
          const content = new Buffer(data).toString()
          response.__parsedResponseBody__ = JSON.parse(content)
          return response
        })
    }
    return (parsedResponse || response)
  }
}

export function getFile(token, key, nonce, onFulfilled = fulfillGetFile) {
  const init = {
    method: 'GET',
    headers: { 'Authorization':'Bearer ' + token },
    cache: 'no-store'
  }

  return fetch(`http://localhost:8100/nfs/file/${encodeURIComponent('/todomvc.json')}/false`, init)
    .then(onFulfilled(key, nonce))
}

export function putFile(token, key, nonce, payload) {
  const content = JSON.stringify(payload)
  const data = libsodium.crypto_secretbox_easy(content, nonce, key)

  const init = {
    method: 'PUT',
    headers: { 'Authorization':'Bearer ' + token, 'Content-Type':'text/plain' },
    body: new Buffer(data).toString('base64')
  }

  return fetch(`http://localhost:8100/nfs/file/${encodeURIComponent('/todomvc.json')}/false`, init)
}

export function postFile(token, key, nonce) {
  const payload = {
    filePath: '/todomvc.json', isPathShared: false
  }

  const content = JSON.stringify(payload)
  const data = libsodium.crypto_secretbox_easy(content, nonce, key)

  const init = {
    method: 'POST',
    headers: { 'Authorization':'Bearer ' + token, 'Content-Type':'text/plain' },
    body: new Buffer(data).toString('base64')
  }

  return fetch('http://localhost:8100/nfs/file', init)
}

export function deleteFile(token) {
  const init = {
    method: 'DELETE',
    headers: { 'Authorization':'Bearer ' + token }
  }

  return fetch(`http://localhost:8100/nfs/file/${encodeURIComponent('/todomvc.json')}/false`, init)
}
