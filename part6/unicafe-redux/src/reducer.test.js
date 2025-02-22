import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  const goodAction = {
    type: 'GOOD'
  } 

  const badAction = {
    type: 'BAD'
  } 

  const okAction = {
    type: 'OK'
  } 

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const state = initialState
    
    deepFreeze(state)

    const newState = counterReducer(state, goodAction)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('bad is incremented', () => {
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, badAction)
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
  })

  test('ok is incremented', () => {
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, okAction)
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })

  test('stats can be reset', () => {
    const action = {
      type: 'ZERO'
    } 
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 0
    })
  })

  test('wanted feedback is saved to the store', () => {
    const state = initialState

    deepFreeze(state)

    const goodState = counterReducer(state, goodAction)
    const goodState1 = counterReducer(goodState, goodAction)
    const goodState2 = counterReducer(goodState1, goodAction)
    const goodState3 = counterReducer(goodState2, goodAction)
    const goodState4 = counterReducer(goodState3, goodAction)
    const okstate = counterReducer(goodState4, okAction)
    const okstate1 = counterReducer(okstate, okAction)
    const okstate2 = counterReducer(okstate1, okAction)
    const okstate3 = counterReducer(okstate2, okAction)
    const badState = counterReducer(okstate3, badAction)
    const badstate1 = counterReducer(badState, badAction)
    expect(badstate1).toEqual({
      good: 5,
      ok: 4,
      bad: 2
    })
  })
})