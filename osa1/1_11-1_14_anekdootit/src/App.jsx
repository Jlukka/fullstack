import { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick = {handleClick}>
    {text}
  </button>
)

const AnecdoteDisplay = ({title, anecdote, votes}) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const [selected, setSelected] = useState(0)

  const maxIndex = votes.indexOf(Math.max(...votes))

  const newAnecdote = () => {
    const newIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(newIndex)
  }

  const voteAnecdote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  return (
    <div>
      <AnecdoteDisplay title="Anecdote of the day" anecdote={anecdotes[selected]} votes={votes[selected]}/>
      <Button handleClick={voteAnecdote} text="vote"/>
      <Button handleClick={newAnecdote} text="next anecdote"/>
      <AnecdoteDisplay title="Anecdote with most votes" anecdote={anecdotes[maxIndex]} votes={votes[maxIndex]}/>
    </div>
  )
}

export default App