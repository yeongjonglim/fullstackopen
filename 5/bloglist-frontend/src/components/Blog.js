import React, { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog }) => {
    const [ visible, setVisibility ] = useState(false)

    const blogStyle = {
        padding: 5,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const toggleVisibility = () => {
        setVisibility(!visible)
    }

    const increaseLike = () => {
        const updatingBlog = {
            ...blog,
            user: blog.user.id
        }
        updatingBlog.likes += 1
        updateBlog(updatingBlog)
    }

    const deleteBlog = () => {
        const confirmed = window.confirm(`Remove blog ${blog.title}${blog.author && ` by ${blog.author}`}?`)
        if (confirmed) {
            removeBlog(blog)
        }
    }

    const layoutRendering = () => {
        if (visible) {
            return (
                <div>
                    <div>
                        {blog.title}{blog.author && ` by ${blog.author}`} <button onClick={toggleVisibility}>hide</button>
                    </div>
                    <div>
                        {blog.url}
                    </div>
                    <div>
                        {blog.likes} likes <button onClick={increaseLike}>like</button>
                    </div>
                    <div>
                        {blog.user.name}
                    </div>
                    <div>
                        <button onClick={deleteBlog}>remove</button>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div>
                        {blog.title}{blog.author && ` by ${blog.author}`} <button onClick={toggleVisibility}>show</button>
                    </div>
                </div>
            )
        }
    }

    return (
        <div style={blogStyle}>
            {layoutRendering()}
        </div>
    )
}

export default Blog
