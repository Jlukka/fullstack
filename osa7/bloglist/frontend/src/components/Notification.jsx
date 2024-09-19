import { useSelector } from "react-redux"

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (notification.style === null || notification.text === null) {
    return null;
  }
  return <div className={notification.style}>{notification.text}</div>;
};

export default Notification;
