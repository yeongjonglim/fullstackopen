import React from 'react'
//import { useSelector, useDispatch } from 'react-redux'
import { connect } from 'react-redux'
import { upVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = ({ anecdotes, filters, upVote, setNotification }) => {
    // const anecdotes = useSelector(({ anecdotes, filters }) => {
    //     return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filters.toLowerCase()))
    // })
    // const dispatch = useDispatch()

    const vote = (anecdote) => {
        upVote(anecdote)
        setNotification(`You voted '${anecdote.content}'`, 3)
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

const mapDispatchToProps = {
    upVote,
    setNotification,
}

const mapStateToProps = (state) => {
    // sometimes it is useful to console log from mapStateToProps
    console.log(state)
    return {
        anecdotes: state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filters.toLowerCase())),
        filters: state.filters
    }
}

const ConnectedAnecdoteList = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdoteList
