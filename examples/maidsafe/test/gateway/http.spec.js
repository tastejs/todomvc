import expect from 'expect'

import * as http from '../../js/gateway/http'
import fetch from 'fetch-mock'
import * as libsodium from 'libsodium-wrappers'


describe('http gateway', () => {
  afterEach(() => { fetch.restore() })

  describe('authorizations', () => {
    context('.postAuth()', () => {
      specify('bad request', (done) => {
        fetch.mock('http://localhost:8100/auth', 'POST', 400)
        http.postAuth()
          .then((response) => {
            expect(response.status).toEqual(400)
            done()
          })
      })

      specify('unauthorized', (done) => {
        fetch.mock('http://localhost:8100/auth', 'POST', 401)
        http.postAuth()
          .then((response) => {
            expect(response.status).toEqual(401)
            done()
          })
      })

      specify('succesful', (done) => {
        const response = { status: 500 }
        const matcher = function(url, opts) {
          expect(opts.headers['Content-Type']).toBe('application/json')

          const body = JSON.parse(opts.body)
          expect(body.app).toExist()
          expect(body.publicKey).toExist()
          expect(body.nonce).toExist()
          expect(body.permissions).toExist()

          const applicationAssymetricKeys = {
            publicKey: new Uint8Array(new Buffer(body.publicKey, 'base64')),
            nonce: new Uint8Array(new Buffer(body.nonce, 'base64'))
          }

          const launcherAssymetricKeys = libsodium.crypto_box_keypair()
          const launcherSymmetricKey = libsodium.randombytes_buf(libsodium.crypto_secretbox_KEYBYTES)
          const launcherSymmetricNonce = libsodium.randombytes_buf(libsodium.crypto_secretbox_NONCEBYTES)

          const content = new Uint8Array(launcherSymmetricKey.byteLength + launcherSymmetricNonce.byteLength)
          content.set(new Uint8Array(launcherSymmetricKey), 0)
          content.set(new Uint8Array(launcherSymmetricNonce), launcherSymmetricKey.byteLength)

          const data = libsodium.crypto_box_easy(
            content, applicationAssymetricKeys.nonce, applicationAssymetricKeys.publicKey, launcherAssymetricKeys.privateKey
          )

          response.status = 200
          response.body   = JSON.stringify({
            token: 'token',
            permissions: [],
            publicKey: new Buffer(launcherAssymetricKeys.publicKey).toString('base64'),
            encryptedKey: new Buffer(data).toString('base64'),
            __launcherSymmetricKey: new Buffer(launcherSymmetricKey).toString('base64'),
            __launcherSymmetricNonce: new Buffer(launcherSymmetricNonce).toString('base64')
          })

          return url === 'http://localhost:8100/auth'
        }

        fetch.mock(matcher, 'POST', response)

        http.postAuth((assymetricKeys, assymetricNonce) => {
          return function(response) {
            expect(response.status).toEqual(200)

            expect(response.__parsedResponseBody__.token).toBe('token')
            expect(response.__parsedResponseBody__.permissions).toEqual([])
            expect(response.__parsedResponseBody__.publicKey).toExist()
            expect(response.__parsedResponseBody__.encryptedKey).toExist()

            http.fulfillPostAuth(assymetricKeys, assymetricNonce)(response)
            expect(response.__parsedResponseBody__.symmetricKeys.key).toBe(response.__parsedResponseBody__.__launcherSymmetricKey)
            expect(response.__parsedResponseBody__.symmetricKeys.nonce).toBe(response.__parsedResponseBody__.__launcherSymmetricNonce)

            done()
          }
        })
      })
    })

    context('.getAuth(token)', () => {
      const matcher = function(url, opts) {
        expect(opts.headers['Authorization']).toBe('Bearer token')
        return url === 'http://localhost:8100/auth'
      }

      specify('bad request', (done) => {
        fetch.mock(matcher, 'GET', 400)
        http.getAuth('token')
          .then((response) => {
            expect(response.status).toEqual(400)
            done()
          })
      })

      specify('succesful', (done) => {
        fetch.mock(matcher, 'GET', 200)
        http.getAuth('token').then((response) => {
          expect(response.status).toEqual(200)
          done()
        })
      })
    })

    context('.deleteAuth(token)', () => {
      const matcher = function(url, opts) {
        expect(opts.headers['Authorization']).toBe('Bearer token')
        return url === 'http://localhost:8100/auth'
      }

      specify('bad request', (done) => {
        fetch.mock(matcher, 'DELETE', 400)
        http.deleteAuth('token')
          .then((response) => {
            expect(response.status).toEqual(400)
            done()
          })
      })

      specify('unauthorized', (done) => {
        fetch.mock(matcher, 'DELETE', 401)
        http.deleteAuth('token')
          .then((response) => {
            expect(response.status).toEqual(401)
            done()
          })
      })

      specify('succesful', (done) => {
        fetch.mock(matcher, 'DELETE', 200)
        http.deleteAuth('token').then((response) => {
          expect(response.status).toEqual(200)
          done()
        })
      })
    })
  })

  describe('persistence', () => {
    context('getFile(token, key, nonce)', (done) => {
      const key = libsodium.randombytes_buf(libsodium.crypto_secretbox_KEYBYTES)
      const nonce = libsodium.randombytes_buf(libsodium.crypto_secretbox_NONCEBYTES)

      const matcher = function(url, opts) {
        expect(opts.headers['Authorization']).toBe('Bearer token')
        return url === 'http://localhost:8100/nfs/file/%2Ftodomvc.json/false'
      }

      specify('bad request', (done) => {
        fetch.mock(matcher, 'GET', 400)
        http.getFile('token', key, nonce)
          .then((response) => {
            expect(response.status).toEqual(400)
            done()
          })
      })

      specify('unauthorized', (done) => {
        fetch.mock(matcher, 'GET', 401)
        http.getFile('token', key, nonce)
          .then((response) => {
            expect(response.status).toEqual(401)
            done()
          })
      })

      specify('succesful', (done) => {
        const response = { status: 500 }
        const matcher = function(url, opts) {
          expect(opts.headers['Authorization']).toBe('Bearer token')

          response.status = 200
          const content = JSON.stringify({ message: 'Привет Мир!' })
          response.body = new Buffer(libsodium.crypto_secretbox_easy(content, nonce, key)).toString('base64')

          return url === 'http://localhost:8100/nfs/file/%2Ftodomvc.json/false'
        }

        fetch.mock(matcher, 'GET', response)
        http.getFile('token', key, nonce)
          .then((response) => {
            expect(response.status).toEqual(200)
            expect(response.__parsedResponseBody__).toEqual({ message: 'Привет Мир!' })
            done()
          })
      })
    })

    context('.putFile(token, key, nonce, payload)', (done) => {
      const payload = { message: 'Привет Мир!' }
      const key = libsodium.randombytes_buf(libsodium.crypto_secretbox_KEYBYTES)
      const nonce = libsodium.randombytes_buf(libsodium.crypto_secretbox_NONCEBYTES)

      const matcher = function(url, opts) {
        expect(opts.headers['Authorization']).toBe('Bearer token')
        expect(opts.headers['Content-Type']).toBe('text/plain')
        const data = libsodium.crypto_secretbox_easy(JSON.stringify(payload), nonce, key)
        expect(opts.body).toBe(new Buffer(data).toString('base64'))

        return url === 'http://localhost:8100/nfs/file/%2Ftodomvc.json/false'
      }

      specify('succesful', (done) => {
        fetch.mock(matcher, 'PUT', 200)
        http.putFile('token', key, nonce, payload)
          .then((response) => {
            expect(response.status).toEqual(200)
            done()
          })
      })

      specify('bad request', (done) => {
        fetch.mock(matcher, 'PUT', 400)
        http.putFile('token', key, nonce, payload)
          .then((response) => {
            expect(response.status).toEqual(400)
            done()
          })
      })

      specify('unauthorized', (done) => {
        fetch.mock(matcher, 'PUT', 401)
        http.putFile('token', key, nonce, payload)
          .then((response) => {
            expect(response.status).toEqual(401)
            done()
          })
      })
    })

    context('.postFile(token, key, nonce)', (done) => {
      const payload = { filePath: '/todomvc.json', isPathShared: false }
      const key = libsodium.randombytes_buf(libsodium.crypto_secretbox_KEYBYTES)
      const nonce = libsodium.randombytes_buf(libsodium.crypto_secretbox_NONCEBYTES)

      const matcher = function(url, opts) {
        expect(opts.headers['Authorization']).toBe('Bearer token')
        expect(opts.headers['Content-Type']).toBe('text/plain')
        const data = libsodium.crypto_secretbox_easy(JSON.stringify(payload), nonce, key)
        expect(opts.body).toBe(new Buffer(data).toString('base64'))

        return url === 'http://localhost:8100/nfs/file'
      }

      specify('succesful', (done) => {
        fetch.mock(matcher, 'POST', 200)
        http.postFile('token', key, nonce)
          .then((response) => {
            expect(response.status).toEqual(200)
            done()
          })
      })

      specify('unauthorized', (done) => {
        fetch.mock(matcher, 'POST', 401)
        http.postFile('token', key, nonce)
          .then((response) => {
            expect(response.status).toEqual(401)
            done()
          })
      })

      specify('bad request', (done) => {
        fetch.mock(matcher, 'POST', 400)
        http.postFile('token', key, nonce)
          .then((response) => {
            expect(response.status).toEqual(400)
            done()
          })
      })
    })

    describe('.deleteFile(token)', () => {
      const matcher = function(url, opts) {
        expect(opts.headers['Authorization']).toBe('Bearer token')
        return url === 'http://localhost:8100/nfs/file/%2Ftodomvc.json/false'
      }

      specify('succesful', (done) => {
        fetch.mock(matcher, 'DELETE', 200)
        http.deleteFile('token')
          .then((response) => {
            expect(response.status).toEqual(200)
            done()
          })
      })

      specify('unauthorized', (done) => {
        fetch.mock(matcher, 'DELETE', 401)
        http.deleteFile('token')
          .then((response) => {
            expect(response.status).toEqual(401)
            done()
          })
      })

      specify('bad request', (done) => {
        fetch.mock(matcher, 'DELETE', 400)
        http.deleteFile('token')
          .then((response) => {
            expect(response.status).toEqual(400)
            done()
          })
      })
    })
  })

  context('app payload', () => {
    it('gets payload details from package.json', () => {
      const details = http.app()
      expect(details.name).toNotBe(undefined)
      expect(details.version).toNotBe(undefined)
      expect(details.vendor).toNotBe(undefined)
      expect(details.id).toNotBe(undefined)
    })
  })
})
