import { useState, useEffect } from 'react'
import axios from 'axios'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personsService from './services/persons'

const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={error ? errorStyle : notificationStyle}>
      {message}
    </div>
  )
}

const Header = ({text}) => {
  return <h2>{text}</h2>
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  
  const [filterText, setFilterText] =useState('')
  const [showAllNames, setShowAllNames] = useState(true)

  const [message, setMessage] = useState(null)

  // errorOrNot, true if its error, false if it is notification
  const [errorOrNot, setErrorOrNot] = useState(false)
  
  useEffect(() => {
    personsService
      .getAllPersons()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const updateMessage = (message, error) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
    setErrorOrNot(error)
  }

  const addPerson = (event) =>{
    event.preventDefault()
    const existingPersonWithSameName = persons.find(person => person.name===newName)
    if(existingPersonWithSameName) {
      if (window.confirm(`${existingPersonWithSameName.name} is already added to phonebook, replace the old number with the new one?`)) {
        const changedPerson = { ...existingPersonWithSameName, number: newNumber }
        personsService
          .updatePerson(changedPerson.id, changedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id == existingPersonWithSameName.id ? changedPerson : person))
            updateMessage(`${existingPersonWithSameName.name} number has been updated`, false)
          })
          .catch(error => {
            updateMessage(`Information of '${existingPersonWithSameName.name}' has already been removed from server`, true)
          })
      }
    } else {
      const id = "" + (parseInt(persons[persons.length - 1].id)+1) +""
      const personObject = {
        name: newName, 
        number: newNumber,
        id: id,
      }  
      personsService.createPerson(personObject)
      setPersons(persons.concat(personObject))  
      updateMessage(`${newName} has been added`, false)
    }
    setNewName("")
    setNewNumber("")
    setFilterText("")
    setShowAllNames(true)
  }


  const handleDeletePerson = (personToBeDeleted) => {
    if (window.confirm(`Delete ${personToBeDeleted.name} ? `)) {
      personsService
        .deletePerson(personToBeDeleted.id)
        .then(reponse => {
          setPersons(persons.filter(person => person.name !== personToBeDeleted.name))
          updateMessage(`${personToBeDeleted.name} has been deleted`, false)
        })
        .catch(error => {
          updateMessage(`Person '${personToBeDeleted.name}' has already been removed from server`, true)
        })
    } 
  }

  const handleNameChange = (event) =>{
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) =>{
    setFilterText(event.target.value)
    setShowAllNames(false)
  }

  const personsToShow = showAllNames ? persons : persons.filter(person =>person.name.toLowerCase().includes(filterText.toLowerCase()))

  return (
    <div>
      <Header text="Phonebook" />
      <Notification message={message} error={errorOrNot} />
      <Filter filterText={filterText} handleFilterChange={handleFilterChange}/>
      <Header text="Add a new" />
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange}
      />
      <Header text="Numbers" />
      {personsToShow.map(person => 
        <Person
          key={person.name}
          person={person}
          handleDeletePerson={()=>handleDeletePerson(person)}
        />
      )}
    </div>
  )
}

export default App