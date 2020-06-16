import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
    const notification = useSelector(({ notification }) => ({
        message: notification.message,
        type: notification.type
    }))

    return (
        <div>
            {notification.message && <p className={notification.type}>{notification.message}</p>}
        </div>
    )
}

export default Notification
