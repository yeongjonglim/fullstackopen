import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    LoginForm.propTypes = {
        handleLogin: PropTypes.func.isRequired
    }

    const userLogin = (event) => {
        event.preventDefault()
        handleLogin({
            username,
            password
        })
    }

    return (
        <div>
            <h2>log in to application</h2>
            <form onSubmit={userLogin}>
                <div>
                    username
                    <input
                        type="text"
                        id="input--username"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        id="input--password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit" id="button--login">login</button>
            </form>
        </div>
    )
}

export default LoginForm
