import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

//const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVote(state, action) {
      const id = action.payload
      const anectodeToUpdate = state.find(n => n.id === id)
      const changedAnectode = {
        ...anectodeToUpdate, 
        votes: anectodeToUpdate.votes+1
      }
      return state.map(n => n.id === id ? changedAnectode : n)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdote, addVote, setAnecdotes } = anecdoteSlice.actions

export const initialAnecdotes = () => {
  return async dispatch => {
      const anecdotes = await anecdoteService.getAll()
      dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const vote = (anecdote) => {
  return async dispatch => {
    await anecdoteService.addVote(anecdote)
    dispatch(addVote(anecdote.id))
  }
}

export default anecdoteSlice.reducer
