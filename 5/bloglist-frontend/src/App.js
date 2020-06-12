import React, { useState, useEffect } from 'react'
import './App.css'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [message, setMessage] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)

    const blogFormRef = React.useRef()

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( sortedBlogs(blogs) )
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const sortedBlogs = (blogs) => {
        const returnBlogs = blogs.concat()
        return returnBlogs.sort((a, b) => b.likes - a.likes)
    }

    const createBlog = async (blogObject) => {
        const createdBlog = await blogService.create(blogObject)
        if (createdBlog) {
            setBlogs( sortedBlogs(blogs.concat(createdBlog)) )
            messageHandler(`${blogObject.title}${blogObject.author && ` by ${blogObject.author}`} added`, 'inform')
            blogFormRef.current.toggleVisibility()
        }
    }

    const updateBlog = async (blogObject) => {
        const updatedBlog = await blogService.update(blogObject.id, blogObject)
        if (updatedBlog) {
            setBlogs( blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog) )
        }
    }

    const removeBlog = async (blogObject) => {
        try {
            await blogService.remove(blogObject.id)
            setBlogs( blogs.filter(blog => blog.id !== blogObject.id) )
            messageHandler(`${blogObject.title}${blogObject.author && ` by ${blogObject.author}`} removed`, 'inform')
        } catch(exception) {
            messageHandler('Unauthorised to delete blog', 'error')
        }
    }

    const layoutSelection = () => {
        if (user === null) {
            return (
                <LoginForm handleLogin={handleLogin} />
            )
        } else {
            return (
                <div>
                    <h2>blogs</h2>
                    <form onSubmit={handleLogout}>
                        <div>
                            {user.name} logged in
                            <button type="submit">logout</button>
                        </div>
                    </form>
                    <hr />
                    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
                        <BlogForm createBlog={createBlog} />
                    </Togglable>
                    <hr />
                    {blogs.map(blog => <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} />)}
                </div>
            )
        }
    }

    const messageHandler = (message, type) => {
        setMessage({
            message,
            type
        })
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    const handleLogin = async (userCredentials) => {
        try {
            const user = await loginService.login(userCredentials)

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
        } catch (exception) {
            messageHandler('Wrong username or password', 'error')
        }
    }

    const handleLogout = async (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
    }

    return (
        <div>
            {message && <p className={message.type}>{message.message}</p>}
            {layoutSelection()}
        </div>
    )
}

export default App
