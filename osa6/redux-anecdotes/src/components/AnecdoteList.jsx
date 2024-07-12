import { useDispatch, useSelector } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { notificationChange } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return anecdotes
      .filter(anecdote => anecdote.content.includes(filter))
      .sort((a, b) => b.votes - a.votes)
  })

  const vote = (id, title) => {
    dispatch(voteAnecdote(id))
    dispatch(notificationChange(`you voted '${title}'`))
    setTimeout(() => dispatch(notificationChange('')), 5000)
  }

  return (
    <ul>
    {anecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => dispatch(vote(anecdote.id, anecdote.content))}>vote</button>
        </div>
      </div>
    )}
    </ul>
  )
}

export default AnecdoteList