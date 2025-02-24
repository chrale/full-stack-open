import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const Anecdote = ({ content, votes, handleClick }) => {
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
  handleClick: PropTypes.func.isRequired,
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if(state.filter === 'ALL') {
      return state.anecdotes 
    }
    return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
  })
  const dispatch = useDispatch()

  return (
    <div>
      {anecdotes
        .sort((anecdoteA, anecdoteB) => anecdoteB.votes-anecdoteA.votes)
        .map(anecdote =>
          <Anecdote 
            key = {anecdote.id}
            content = {anecdote.content}
            votes = {anecdote.votes}
            handleClick = {() => dispatch(vote(anecdote.id))}    
          />
    )}
    </div>
  )
}

export default AnecdoteList