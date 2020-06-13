import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { upVote } from '../reducers/anecdoteReducer'
import { generateNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(({ anecdotes, filters }) => {
        return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filters.toLowerCase()))
    })
    const dispatch = useDispatch()

    const vote = (anecdote) => {
        dispatch(upVote(anecdote.id))
        generateNotification(dispatch, `You voted '${anecdote.content}'`, 'INFORM')
    }

    const orderedAnecdotes = () => {
        return anecdotes.sort((a, b) => b.votes - a.votes)
    }


    return (
        <div>
            {orderedAnecdotes().map(anecdote =>
            <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => vote(anecdote)}>vote</button>
                </div>
            </div>
            )}
        </div>
    )
}

export default AnecdoteList
