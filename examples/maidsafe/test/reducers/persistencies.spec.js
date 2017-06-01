import expect from 'expect'

import reducer from '../../js/reducers/persistencies'
import * as actions from '../../js/actions/persistencies'

describe('persistencies reducer', () => {
  it('starts from the beginning', () => {
    expect(reducer(undefined, {})).toEqual({ inFlight: false })
  })

  context('loading', () => {
    specify('.willGet()', () => {
      expect(
        reducer({ inFlight: false }, actions.willGet())
      ).toEqual({ inFlight: true })
    })
    specify('.didGet([<<objects>>])', () => {
      expect(
        reducer({ inFlight: true }, actions.didGet([1,3]))
      ).toEqual({ inFlight: false, todos: [1,3], isFailed: undefined, isOk: true })
    })
    specify('.didGet(false)', () => {
      expect(
        reducer({ inFlight: true }, actions.didGet(false))
      ).toEqual({ inFlight: false, todos: undefined, isFailed: true, isOk: undefined })
    })
  })

  context('storing', () => {
    specify('.willPut()', () => {
      expect(
        reducer({ inFlight: false }, actions.willPut())
      ).toEqual({ inFlight: true })
    })
    specify('.didPut(true)', () => {
      expect(
        reducer({ inFlight: true }, actions.didPut(true))
      ).toEqual({ inFlight: false, isFailed: undefined, isOk: true })
    })
    specify('.didPut(false)', () => {
      expect(
        reducer({ inFlight: true }, actions.didPut(false))
      ).toEqual({ inFlight: false, isFailed: true, isOk: undefined })
    })
  })
})
