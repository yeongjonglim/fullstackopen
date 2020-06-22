import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'

const ALL_AUTHORS = gql`
    query allAuthors {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

const SET_BIRTHYEAR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!){
        editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            born
        }
    }
`

const Authors = ({ token, setError, show }) => {
    const result = useQuery(ALL_AUTHORS)
    const [authors, setAuthors] = useState([])
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')

    const [editAuthor] = useMutation(SET_BIRTHYEAR, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        },
        refetchQueries: [ { query: ALL_AUTHORS } ]
    })

    const submit = async (event) => {
        event.preventDefault()

        editAuthor({ variables: { name, setBornTo: Number(born) } })

        setName('')
        setBorn('')
    }

    useEffect(() => {
        if(!result.loading) {
            setAuthors(result.data.allAuthors)
        }
    }, [result])

    if (!show) {
        return null
    }

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            born
                        </th>
                        <th>
                            books
                        </th>
                    </tr>
                    {authors.map(a =>
                    <tr key={a.name}>
                        <td>{a.name}</td>
                        <td>{a.born}</td>
                        <td>{a.bookCount}</td>
                    </tr>
                    )}
                </tbody>
            </table>

            {token &&
            <>
            <h2>Set birthyear</h2>
            <form onSubmit={submit}>
                <select value={name} onChange={({ target }) => setName(target.value)}>
                    {authors.map(author =>
                    <option key={author.name} value={author.name}>{author.name}</option>
                    )}
                </select>
                <div>
                    born
                    <input
                        type='number'
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>
                <button type='submit'>update author</button>
            </form>
            </>}
        </div>
    )
}

export default Authors
