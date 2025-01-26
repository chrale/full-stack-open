const ErrorMessage = ({ message }) => {
  return (
    <div className="error">
      {message}
    </div>
  )
}

const SuccessMessage = ({ message }) => {
  return (
    <div className="success">
      {message}
    </div>
  )
}

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <>
      {notification.error ?
        <ErrorMessage message = {notification.message}/> :
        <SuccessMessage message = {notification.message} />
      }
    </>
  )
}

export default Notification