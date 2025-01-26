import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = (event) => {
    event.preventDefault()
    login({
      username: username,
      password: password
    })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          name="Username"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          name="Password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

export default LoginForm