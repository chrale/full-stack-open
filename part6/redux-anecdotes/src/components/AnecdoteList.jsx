import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import { vote } from '../reducers/anecdoteReducer'
import { showNotification, hideNotification } from '../reducers/notificationReducer'

const Anecdote = ({ content, votes, id }) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(vote(id))
    dispatch(showNotification(`you voted '${content}'`))
    setTimeout(()=>{
      dispatch(hideNotification())
    }, 5000)
  }

  return (
    <div>
      <div>{content}</div>
      <div>
        has {votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

Anecdote.propTypes = {
  content: PropTypes.string.isRequired,
  votes: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
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
            content = {anecdote.content}
            votes = {anecdote.votes}
            id = {anecdote.id}    
          />
    )}
    </div>
  )
}

export default AnecdoteList