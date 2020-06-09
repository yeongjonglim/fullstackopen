import React, { useState, useEffect } from 'react'
import './App.css'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [message, setMessage] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
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

    const messageHandler = (message, type) => {
        setMessage({
            message,
            type
        })
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            messageHandler('Wrong username or password', 'error')
        }
    }

    const handleLogout = async (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
    }

    const handleCreate = async (event) => {
        event.preventDefault()
        const createdBlog = await blogService.create({
            title,
            author,
            url
        })
        if (createdBlog) {
            setBlogs(blogs.concat(createdBlog))
            messageHandler(`${title} by ${author} added`, 'inform')
            setTitle('')
            setAuthor('')
            setUrl('')
        }
    }

    const layoutSelection = () => {
        if (user === null) {
            return (
                <div>
                    <h2>log in to application</h2>
                    <form onSubmit={handleLogin}>
                        <div>
                            username
                            <input
                                type="text"
                                value={username}
                                name="Username"
                                onChange={({ target }) => setUsername(target.value)}
                            />
                        </div>
                        <div>
                            password
                            <input
                                type="password"
                                value={password}
                                name="Password"
                                onChange={({ target }) => setPassword(target.value)}
                            />
                        </div>
                        <button type="submit">login</button>
                    </form>
                </div>
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
                    <div>
                        <h2>create new</h2>
                        <form onSubmit={handleCreate}>
                            <div>
                                title:
                                <input
                                    type="text"
                                    value={title}
                                    name="Username"
                                    onChange={({ target }) => setTitle(target.value)}
                                />
                            </div>
                            <div>
                                author:
                                <input
                                    type="text"
                                    value={author}
                                    name="Author"
                                    onChange={({ target }) => setAuthor(target.value)}
                                />
                            </div>
                            <div>
                                url:
                                <input
                                    type="url"
                                    value={url}
                                    name="Url"
                                    onChange={({ target }) => setUrl(target.value)}
                                />
                            </div>
                            <button type="submit">create</button>
                        </form>
                    </div>
                    {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
                </div>
            )
        }
    }

    return (
        <div>
            {message && <p className={message.type}>{message.message}</p>}
            {layoutSelection()}
        </div>
    )
}

export default App
