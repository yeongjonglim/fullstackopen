import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Button } from 'antd'
import { updateBlog, updateBlogComment, removeBlog } from '../reducers/blogReducer'

const Blog = ({ id }) => {
    const blogs = useSelector(({ blogs }) => blogs)
    const blog = blogs.find(blog => blog.id === id)
    const [, forceUpdate] = useState() // To disable submit button at the beginning.
    const [form] = Form.useForm()

    useEffect(() => {
        forceUpdate({})
    }, [])

    const dispatch = useDispatch()

    const increaseLike = () => {
        const updatingBlog = {
            ...blog,
            user: blog.user.id
        }
        updatingBlog.likes += 1
        dispatch(updateBlog(updatingBlog))
    }

    const deleteBlog = () => {
        const confirmed = window.confirm(`Remove blog ${blog.title}${blog.author && ` by ${blog.author}`}?`)
        if (confirmed) {
            dispatch(removeBlog(blog))
        }
    }

    const onFinish = values => {
        const updatingBlog = {
            ...blog,
            user: blog.user.id,
            comments: blog.comments.concat(values.comment)
        }
        dispatch(updateBlogComment(updatingBlog))
        form.resetFields()
    }

    if (!blog) {
        return <div />
    }

    return (
        <div>
            <h2>
                {blog.title}{blog.author && ` by ${blog.author}`}
            </h2>
            <a href={blog.url}>
                {blog.url}
            </a>
            <div className="likes">
                {blog.likes} likes <button onClick={increaseLike}>like</button>
            </div>
            <div>
                {blog.user.name}
            </div>
            <div>
                <button onClick={deleteBlog}>remove</button>
            </div>
            <h3>comments</h3>
            <Form form={form} name="comments" layout="inline" onFinish={onFinish}>
                <Form.Item
                    style={{ width: '60%' }}
                    name="comment"
                >
                    <Input placeholder="Comment" />
                </Form.Item>
                <Form.Item shouldUpdate>
                    {() => (
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={
                                !form.isFieldsTouched(true) ||
                                    form.getFieldsError().filter(({ errors }) => errors.length).length
                            }
                        >
                            Submit
                        </Button>
                    )}
                </Form.Item>
            </Form>
            <ul>
                {blog.comments.map((comment, index) => <li key={index}>{comment}</li>)}
            </ul>
        </div>
    )
}

export default Blog
