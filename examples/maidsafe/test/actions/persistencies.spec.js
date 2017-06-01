import expect from 'expect'

import * as actions from '../../js/actions/persistencies'

describe('persistencies actions', () => {
  context('loading', () => {
    specify('.willGet()', () => {
      expect(actions.willGet()).toEqual({ type: 'getting' })
    })
    specify('.didGet([<<objects>>])', () => {
      expect(actions.didGet([1,2])).toEqual({ type: 'got', todos: [1,2], isOk: true })
    })
    specify('.didGet(false)', () => {
      expect(actions.didGet(false)).toEqual({ type: 'got', isFailed: true })
    })
  })

  context('storing', () => {
    specify('.willPut()', () => {
      expect(actions.willPut()).toEqual({ type: 'putting' })
    })
    specify('.didPut(true)', () => {
      expect(actions.didPut(true)).toEqual({ type: 'put', isOk: true })
    })
    specify('.didPut(false)', () => {
      expect(actions.didPut(false)).toEqual({ type: 'put', isFailed: true })
    })
  })
})
