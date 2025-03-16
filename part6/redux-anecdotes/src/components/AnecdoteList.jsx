import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote }) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(vote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.object.isRequired,
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if(state.filter === 'ALL') {
      return state.anecdotes 
    }
    return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
  })

  return (
    <div>
      {[...anecdotes]
        .sort((anecdoteA, anecdoteB) => anecdoteB.votes-anecdoteA.votes)
        .map(anecdote =>
          <Anecdote 
            key = {anecdote.id}
            anecdote = {anecdote} 
          />
    )}
    </div>
  )
}

export default AnecdoteList