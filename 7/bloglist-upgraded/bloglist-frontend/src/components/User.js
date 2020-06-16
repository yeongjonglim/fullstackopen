import React, { useEffect, useState } from 'react'
import userService from '../services/users'

const User = ({ id }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        async function fetchData() {
            const users = await userService.getUsers()
            setUser(users.find(user => user.id === id))
        }
        fetchData()
    }, [id])

    if (!user) {
        return <div/>
    }

    return (
        <div>
            <h2>{user.name}</h2>
            <p>Added Blogs</p>
            <ul>
                {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
            </ul>
        </div>
    )
}

export default User
