import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  console.log(notification.visible)
  console.log(notification.message)
  if (notification.visible) {
    return (
      <div style={style}>
        {notification.message}
      </div> 
    )
  }
  return null
}

export default Notification