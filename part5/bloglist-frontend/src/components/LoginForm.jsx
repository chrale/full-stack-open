const LoginForm = ({
    username,
    password,
    handleUsernameChange,
    handlePasswordChange,
    handleLogin
    }) => {
    return (
        <form onSubmit={handleLogin}>
          <div>
            username
            <input 
              type="text"
              name="Username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            password
            <input 
              type="password"
              name="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit">login</button>
        </form>
    )
}

export default LoginForm