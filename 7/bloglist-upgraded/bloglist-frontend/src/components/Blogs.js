import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { getBlog } from '../reducers/blogReducer'

const Blogs = () => {
    const blogs = useSelector(({ blogs }) => blogs)
    const dispatch = useDispatch()
    const blogFormRef = React.useRef()

    useEffect(() => {
        dispatch(getBlog())
    }, [dispatch])

    const blogStyle = {
        padding: 5,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div>
            <Togglable buttonLabel='create new blog' ref={blogFormRef}>
                <BlogForm toggle={blogFormRef}/>
            </Togglable>
            {blogs.map(blog => (
                <div key={blog.id} style={blogStyle}>
                    <Link to={`/blogs/${blog.id}`}>
                        {blog.title}
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default Blogs
