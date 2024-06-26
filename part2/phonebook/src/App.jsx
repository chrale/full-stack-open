import { Component, useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const Header = ({text}) => {
  return <h2>{text}</h2>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] =useState('')
  const [showAllNames, setShowAllNames] = useState(true)

  const namesToShow = showAllNames ? persons : persons.filter(person =>person.name.toLowerCase().includes(filterText.toLowerCase()))

  const addPerson = (event) =>{
    event.preventDefault()

    console.log("button pressed")

    const personObject = {
      name: newName,
      key: newName, 
      number: newNumber
    }

    if(persons.find(person => person.name===personObject.name)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(personObject))  
    }
    setNewName("")
    setNewNumber("")
    setFilterText("")
    setShowAllNames(true)
  }

  const handleNameChange = (event) =>{
    console.log("handle name change: ", event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log("handle number change: ", event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) =>{
    console.log("handle filter change: ", event.target.value)
    setFilterText(event.target.value)
    setShowAllNames(false)
  }


  return (
    <div>
      <Header text="Phonebook" />
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
      <Persons persons={namesToShow} />
    </div>
  )
}

export default App