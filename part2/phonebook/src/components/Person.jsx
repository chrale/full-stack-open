const Person = ({person, handleDeletePerson}) =>{
  return (  
    <div>
      {person.name} {person.number}
      <button onClick={handleDeletePerson}>delete</button>
    </div>
  )
}

export default Person