import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const BlogForm = ({ toggle }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const dispatch = useDispatch()

    const handleChange = (event) => {
        if (event.target.name === 'title') {
            setTitle(event.target.value)
        } else if (event.target.name === 'author') {
            setAuthor(event.target.value)
        } else if (event.target.name === 'url') {
            setUrl(event.target.value)
        }
    }

    const handleCreate = (event) => {
        event.preventDefault()

        dispatch(createBlog({
            title,
            author,
            url
        }))

        toggle.current.toggleVisibility()

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleCreate}>
                <div>
                    title:
                    <input
                        id="input--create-title"
                        type="text"
                        value={title}
                        name="title"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    author:
                    <input
                        id="input--create-author"
                        type="text"
                        value={author}
                        name="author"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    url:
                    <input
                        id="input--create-url"
                        type="url"
                        value={url}
                        name="url"
                        onChange={handleChange}
                    />
                </div>
                <button id="button--create" type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm
