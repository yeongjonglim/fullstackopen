import React, { useState, useEffect } from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'

const ME = gql`
    query loggedInUser {
        me {
            username
            favoriteGenre
        }
    }
`

const BOOKS_BY_GENRE = gql`
    query allBooksByGenre($genre: String!) {
        allBooks(genre: $genre) {
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

const Recommend = (props) => {
    const meResult = useQuery(ME, {
        pollInterval: 1000
    })
    const [getBooks, booksResult] = useLazyQuery(BOOKS_BY_GENRE)
    const [user, setUser] = useState({})
    const [books, setBooks] = useState([])

    useEffect(() => {
        if(!meResult.loading) {
            setUser(meResult.data.me)
        }
    }, [meResult])

    useEffect(() => {
        if(user && user.username) {
            getBooks({ variables: { genre: user.favoriteGenre } })
        }
    }, [user, getBooks])

    useEffect(() => {
        if(!booksResult.loading && booksResult.called) {
            setBooks(booksResult.data.allBooks)
        }
    }, [booksResult])

    if (!props.show) {
        return null
    }

    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre <strong>{user && user.favoriteGenre}</strong></p>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            author
                        </th>
                        <th>
                            published
                        </th>
                    </tr>
                    {books.map(b =>
                    <tr key={b.title}>
                        <td>{b.title}</td>
                        <td>{b.author.name}</td>
                        <td>{b.published}</td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Recommend
