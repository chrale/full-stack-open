
const Person = ({name, number}) =>{
    return <div>{name} {number}</div>
  }
  
const Persons = ({persons}) =>{
    return persons.map(person=><Person key={person.key} name={person.name} number={person.number} />)
}

export default Persons