import expect from 'expect'

import * as actions from '../../js/actions/authorizations'

describe('authorizations actions', () => {
  specify('.willAuthorize()', () => {
    expect(actions.willAuthorize()).toEqual({ type: 'authorizing' })
  })
  specify('.didAuthorized(true)', () => {
    expect(actions.didAuthorized(true)).toEqual({ type: 'authorized', isAuthorized: true })
  })
})
