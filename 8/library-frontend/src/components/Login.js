import React, { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'

const ALL_BOOKS = gql`
    query allBooks {
        allBooks {
            title
            author {
                name
                born
            }
            published
            genres
        }
    }
`

const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)  {
            value
        }
    }
`

const ME = gql`
    query loggedInUser {
        me {
            username
            favoriteGenre
        }
    }
`

const Login = ({ setToken, setPage, setError, error, show, client }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [login, result] = useMutation(LOGIN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        },
        refetchQueries: [ { query: ALL_BOOKS }, { query: ME } ],
        onCompleted: () => {
            setUsername('')
            setPassword('')
            setPage('authors')
        }
    })

    useEffect(() => {
        if ( result.data ) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('library-user-token', token)
        } else if (localStorage.getItem('library-user-token')) {
            setToken(localStorage.getItem('library-user-token'))
        }
    }, [result.data, setToken])

    if (!show) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()

        await login({ variables: { username, password } })
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    username
                    <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type='password'
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        </div>
    )
}

export default Login
