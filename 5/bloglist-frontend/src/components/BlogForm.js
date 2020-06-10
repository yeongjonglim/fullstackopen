import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleChange = async (event) => {
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

        createBlog({
            title,
            author,
            url
        })

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
                        type="text"
                        value={title}
                        name="title"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    author:
                    <input
                        type="text"
                        value={author}
                        name="author"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    url:
                    <input
                        type="url"
                        value={url}
                        name="url"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm
