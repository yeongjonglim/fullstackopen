const initialState = ''

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ERROR':
            return action.data.message

        case 'INFORM':
            return action.data.message

        case 'RESET':
            return initialState

        default:
            return state
    }
}

const showNotification = (message, type) => {
    return {
        type,
        data: {message}
    }
}

const hideNotification = () => {
    return {
        type: 'RESET'
    }
}

export const generateNotification = (dispatch, message, type) => {
    dispatch(showNotification(message, type))

    setTimeout(() => {
        dispatch(hideNotification())
    }, 5000)
}

export default reducer
