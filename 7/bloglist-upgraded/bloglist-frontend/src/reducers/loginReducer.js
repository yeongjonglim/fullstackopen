import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'
import loginService from '../services/login'

const initialState = null

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET':
            return action.data

        case 'UNSET':
            return null

        case 'GETALLUSERS':
            return action.data

        default:
            return state
    }
}

export const userCheck = () => {
    return async dispatch => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch ({
                type: 'SET',
                data: user
            })
            blogService.setToken(user.token)
        }
    }
}

export const userLogin = (userCredentials) => {
    return async dispatch => {
        try {
            const user = await loginService.login(userCredentials)

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            dispatch ({
                type: 'SET',
                data: user
            })
            blogService.setToken(user.token)
        } catch (exception) {
            dispatch(setNotification('Wrong username or password', 'ERROR'))
        }
    }
}

export const userLogout = () => {
    return async dispatch => {
        window.localStorage.removeItem('loggedBlogappUser')
        dispatch ({
            type: 'UNSET'
        })
    }
}

export default reducer
