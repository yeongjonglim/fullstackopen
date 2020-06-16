import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userService from '../services/users'
//import { useSelector, useDispatch } from 'react-redux'
//import { getAllUsers } from '../reducers/userReducer'

const Users = () => {
    const [users, setUsers] = useState([])
    //const users = useSelector(({ users }) => users)
    //const dispatch = useDispatch()

    useEffect(() => {
        async function fetchData() {
            const result = await userService.getUsers()
            setUsers(result)
        }
        fetchData()
    }, [])

    return (
        <div>
            <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <td></td>
                        <td>blogs created</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td><Link to={`/users/${user.id}`}>
                                {user.name}</Link></td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Users
