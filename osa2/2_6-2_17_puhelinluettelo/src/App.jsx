import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({style, message}) => {
  if (message === null) {
    return null
  }
  return (
    <div className={style}>
      {message}
    </div>
  )
}

const Filter = ({filter, setFilter}) => {
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({newName, setNewName, newNumber, setNewNumber, addPerson}) => {
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Button = ({handleClick, text}) => (
  <button onClick = {handleClick}>
    {text}
  </button>
)

const Person = ({person, deletePerson}) => {
  return (
  <p>{person.name} {person.number} <Button handleClick = {() => deletePerson(person)} text='delete'/></p>
  )
}

const Persons = ({persons, filter, deletePerson}) => {
  return (
  <div>
  {
    persons.filter((person) => person.name
    .toLowerCase()
    .includes(filter))
    .map(person =>
      <Person key={person.id} person={person} deletePerson={deletePerson}/>
    )}
  </div>)
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMsg, setNotificationMsg] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState('error')

  useEffect(() => {
    console.log('effect')
    personService
    .getAll()
    .then(response => {
      console.log('fulfilled')
      console.log(response.data)
      setPersons(response.data)
    })
  }, [])

  const displayNotifiction = (style, message) => {
    console.log(style)
    console.log(message)
    setNotificationStyle(style)
    setNotificationMsg(message)
    setTimeout(() => {
      setNotificationMsg(null)
    }, 5000)
  }
 
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const found = persons.find((person) => person.name === newName)
    if (found) {
      if (window.confirm(`${found.name} already exists in the phonebook, do you want to replace their old number with the new one?`)) {
        personService
        .update({...found, number: newNumber})
        .then(response => {
          setPersons(persons.map(person => person.id !== found.id ? person : response.data))
        })
        displayNotifiction('notification', `${personObject.name}'s number was changed to ${newNumber}`)
      }
    } else {
    
    personService
    .create(personObject)
    .then(response => {
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
    })
    displayNotifiction('notification', `${personObject.name} was added to the phonebook`)

    }
  }

  const deletePerson = (deletedPerson) => {
    if (window.confirm(`Do you really want to delete ${deletedPerson.name} from the phonebook?`)) {
    personService
    .deletePerson(deletedPerson.id)
    .then(response => {
      setPersons(persons.filter((person) => person.id !== response.data.id))
    displayNotifiction('notification', `${deletedPerson.name} was deleted from the phonebook`)
    }).catch(error => {
      console.log('fail')
    displayNotifiction('error', `ERROR: Information of ${deletedPerson.name} had already been deleted from the phonebook`)
    })
  }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      
      <Notification style={notificationStyle} message={notificationMsg}/>

      <h2>filter by name</h2>

      <Filter filter={filter} setFilter = {setFilter}/>

      <h2>add a new person</h2>

      <PersonForm newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} addPerson={addPerson}/>

      <h2>numbers</h2>
      
      <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
    </div>
  )

}

export default App