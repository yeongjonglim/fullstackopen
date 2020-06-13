import anecdoteService from '../services/anecdotes'

// const anecdotesAtStart = [
//     'If it hurts, do it more often',
//     'Adding manpower to a late software project makes it later!',
//     'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//     'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//     'Premature optimization is the root of all evil.',
//     'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//     return {
//         content: anecdote,
//         id: getId(),
//         //votes: Math.floor(100 * Math.random())
//         votes: 0
//     }
// }

//const initialState = anecdotesAtStart.map(asObject)
const initialState = []

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPVOTE':
            const id = action.data.id
            // const anecdoteToChange = state.find(a => a.id === id)
            // const changedAnecdote = {
            //     ...anecdoteToChange,
            //     votes: anecdoteToChange.votes + 1
            // }
            return state.map(anecdote => anecdote.id === id ? action.data : anecdote)

        case 'CREATE':
            const newAnecdote = action.data
            return state.concat(newAnecdote)

        case 'INIT':
            return action.data

        default:
            return state
    }
}

export const createAnecdote = (content) => {
    return async dispatch => {
        const anecdote = await anecdoteService.createNew(content)
        dispatch({
            type: 'CREATE',
            data: anecdote
        })
    }
}

export const upVote = (data) => {
    return async dispatch => {
        const updatedAnecdote = await anecdoteService.update({
            ...data,
            votes: data.votes + 1
        })
        dispatch({
            type: 'UPVOTE',
            data: updatedAnecdote
        })
    }
}

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch({
            type: 'INIT',
            data: anecdotes
        })
    }
}

export default reducer
