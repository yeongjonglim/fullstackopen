import React, { useState } from 'react'
import { gql, useSubscription, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Notify from './components/Notify'
import Recommend from './components/Recommend'

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

const BOOK_ADDED = gql`
    subscription {
        bookAdded {
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

const App = () => {
    const [page, setPage] = useState('authors')
    const [token, setToken] = useState(null)
    const [error, setError] = useState(null)
    const client = useApolloClient()

    const updateCacheWith = (addedBook) => {
        const includedIn = (set, object) =>
            set.map(b => b.id).includes(object.id)

        const dataInStore = client.readQuery({ query: ALL_BOOKS })
        if (!includedIn(dataInStore.allBooks, addedBook)) {
            client.writeQuery({
                query: ALL_BOOKS,
                data: { allBooks : dataInStore.allBooks.concat(addedBook) }
            })
        }
    }

    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData }) => {
            const addedBook = subscriptionData.data.bookAdded
            window.alert(`${addedBook.title} added`)
            updateCacheWith(addedBook)
            client.reFetchObservableQueries()
            console.log(subscriptionData)
        }
    })

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
        setPage('authors')
    }

    return (
        <div>
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                {token && <button onClick={() => setPage('add')}>add book</button>}
                {!token && <button onClick={() => setPage('login')}>login</button>}
                {token && <button onClick={() => setPage('recommend')}>recommend</button>}
                {token && <button onClick={logout}>logout</button>}
            </div>
            <Notify error={error} setError={setError} />

            <Authors
                show={page === 'authors'}
                token={token}
                setError={setError}
            />

            <Books
                show={page === 'books'}
            />

            <NewBook
                show={page === 'add'}
                setError={setError}
                updateCacheWith={updateCacheWith}
            />

            <Login
                show={page === 'login'}
                setPage={setPage}
                setToken={setToken}
                setError={setError}
                error={error}
                client={client}
            />

            <Recommend
                show={page === 'recommend'}
                token={token}
            />

        </div>
    )
}

export default App
