const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ parts }) => {
    const exercises = parts.map(part=> part.exercises)
    console.log(exercises)
    const total = exercises.reduce((sum, part)=>sum + part,0)
    console.log(total)
    return ( 
      <p>
        <b>total of {total} exercises</b>
      </p>    
    )
}

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
    const content = parts.map(part => <Part key={part.id} part ={part}/>);
    return( 
        content
    )
}
  
const Course = ({course}) => {

  return(
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course