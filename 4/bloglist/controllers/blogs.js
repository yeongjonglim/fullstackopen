const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (body.title === undefined) {
        return response.status(400).json({ error: 'title missing' })
    } else if (body.url === undefined) {
        return response.status(400).json({ error: 'url missing' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const deletingBlog = await Blog.findById(request.params.id)

    if (!deletingBlog) {
        return response.status(204).end()
    }

    if (user._id.toString() === deletingBlog.user.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        user.blogs = user.blogs.filter(blog => blog.toString() !== deletingBlog._id.toString())
        await user.save()
        return response.status(204).end()
    } else {
        return response.status(401).json({ error: 'unauthorized to delete blog' })
    }

})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
    if (updatedBlog) {
        response.status(201).json(updatedBlog.toJSON())
    } else {
        response.status(404).end()
    }
})

module.exports = blogsRouter
