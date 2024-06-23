import { useState } from 'react'

const Header = (props) => {
  return (
    <div>
      <h1>{props.text}</h1>
    </div>
  )
}

const StatisticLine = (props) => {
  return(
    <tr>
      <td>
       {props.text}
      </td> 
      <td>
        {props.value}
      </td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const all = good+neutral+bad
  const average = (good*1+neutral*0+bad*-1)/all 
  const percentage = good/all*100+' %'

  if(all=== 0) {
    return(
      <p>No feedback given</p>
    ) 
  } else {
    return(
      <table>
        <tbody>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={percentage} />
        </tbody>
      </table>
    )
  }
}

const Button = ({text, handleClick}) => {
  return (
      <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text="give feedback" />
      <Button text="good" handleClick={()=> setGood(good+1)}/>
      <Button text="neutral" handleClick={()=> setNeutral(neutral+1)} />
      <Button text="bad" handleClick={()=> setBad(bad+1)} />

      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>

    
  )
}

export default App