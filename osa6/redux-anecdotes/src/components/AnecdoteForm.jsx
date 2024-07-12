import { useDispatch } from "react-redux"
import { newAnecdote } from "../reducers/anecdoteReducer"
import { notificationChange } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const create = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    dispatch(newAnecdote(content))
    dispatch(notificationChange(`new anecdote created '${content}'`))
    setTimeout(() => dispatch(notificationChange('')), 5000)
  }
  
  return (
    <>
    <h2>create new</h2>
    <form onSubmit={create}>
      <div><input name='anecdote'/></div>
      <button>create</button>
    </form>
    </>
  )
}

export default AnecdoteForm