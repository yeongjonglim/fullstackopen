import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const initialState = []

const sortedBlogs = (blogs) => {
    const returnBlogs = blogs.concat()
    return returnBlogs.sort((a, b) => b.likes - a.likes)
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET':
            return sortedBlogs(action.data)

        case 'CREATE':
            return sortedBlogs(state.concat(action.data))

        case 'UPDATE':
            return sortedBlogs(state.map(b => b.id === action.data.id ? action.data : b))

        case 'REMOVE':
            return sortedBlogs(state.filter(b => b.id !== action.data.id))

        default:
            return sortedBlogs(state)
    }
}

export const getBlog = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch ({
            type: 'GET',
            data: blogs
        })
    }
}

export const createBlog = (blogObject) => {
    return async dispatch => {
        const createdBlog = await blogService.create(blogObject)
        if (createdBlog) {
            dispatch({
                type: 'CREATE',
                data: createdBlog
            })
            dispatch(setNotification(`${createdBlog.title}${createdBlog.author && ` by ${createdBlog.author}`} added`, 'INFORM'))
        }
    }
}

export const updateBlog = (blogObject) => {
    return async dispatch => {
        const updatedBlog = await blogService.update(blogObject.id, blogObject)
        if (updatedBlog) {
            dispatch({
                type: 'UPDATE',
                data: updatedBlog
            })
        }
    }
}

export const updateBlogComment = (blogObject) => {
    return async dispatch => {
        const updatedBlog = await blogService.addComment(blogObject.id, blogObject)
        if (updatedBlog) {
            dispatch({
                type: 'UPDATE',
                data: updatedBlog
            })
        }
    }
}

export const removeBlog = (blogObject) => {
    return async dispatch => {
        try {
            await blogService.remove(blogObject.id)
            dispatch({
                type: 'REMOVE',
                data: blogObject
            })
            dispatch(setNotification(`${blogObject.title}${blogObject.author && ` by ${blogObject.author}`} removed`, 'INFORM'))
        } catch(exception) {
            dispatch(setNotification('Unauthorised to delete blog', 'ERROR'))
        }
    }
}


export default reducer
