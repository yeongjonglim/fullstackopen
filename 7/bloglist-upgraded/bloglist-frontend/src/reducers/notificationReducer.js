const initialState = ''

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INFORM':
            return {
                message: action.data.message,
                type: 'inform'
            }

        case 'ERROR':
            return {
                message: action.data.message,
                type: 'error'
            }

        case 'RESET':
            if (action.data.id === nextNotificationId - 1) {
                return initialState
            }
            return state

        default:
            return state
    }
}

const showNotification = (id, message, type = 'INFORM') => {
    return {
        type,
        data: { id, message }
    }
}

const hideNotification = (id) => {
    return {
        type: 'RESET',
        data: { id }
    }
}

let nextNotificationId = 0
export const setNotification = (message, type, timeout=5) => {
    return dispatch => {

        const id = nextNotificationId++
        dispatch(showNotification(id, message, type))

        setTimeout(() => {
            dispatch(hideNotification(id))
        }, timeout*1000)
    }
}

export default reducer
