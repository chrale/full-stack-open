import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => 
  axios.get(baseUrl).then(result => result.data)

export const createAnecdote = newAnecdote =>
  axios.post(baseUrl, newAnecdote).then(result => result.data)

export const voteAnecdote = anecdoteToBeVoted =>
  axios.put(`${baseUrl}/${anecdoteToBeVoted.id}`, anecdoteToBeVoted).then(result => result.data)
