import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>Hello {props.name} you are this old {props.age}</p>
    </div>
  );
}

const App = () => {
  const friends = [ 'Peter', 'Maya']

  return (
    <div>
      <p>{friends}</p>
    </div>
  )
}


export default App
