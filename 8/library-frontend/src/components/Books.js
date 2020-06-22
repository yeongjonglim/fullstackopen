import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'

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

const Books = (props) => {
    const result = useQuery(ALL_BOOKS)
    const [books, setBooks] = useState([])
    const [genres, setGenres] = useState([])
    const [genreFilter, setGenreFilter] = useState('')

    useEffect(() => {
        if(!result.loading) {
            setBooks(result.data.allBooks)
            const nestedGenres = books.map(book => book.genres)
            setGenres([...new Set(nestedGenres.reduce((acc, it) => [...acc, ...it], []))])
        }
    }, [result, books])

    useEffect(() => {
        if (!genreFilter) {
            setGenreFilter(genres[0])
        }
    }, [genreFilter, genres])

    if (!props.show) {
        return null
    }

    const filteredBooks = books.filter(book => book.genres.includes(genreFilter))

    return (
        <div>
            <h2>books</h2>
            <p>in genre <strong>{genreFilter}</strong></p>

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
                    {filteredBooks.map(b =>
                    <tr key={b.title}>
                        <td>{b.title}</td>
                        <td>{b.author.name}</td>
                        <td>{b.published}</td>
                    </tr>
                    )}
                </tbody>
            </table>

            {genres.map(genre =>
            <button key={genre} onClick={() => {
                setGenreFilter(genre)
                result.refetch()
            }}>{genre}</button>
            )}
        </div>
    )
}

export default Books
