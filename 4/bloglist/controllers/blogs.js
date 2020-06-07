const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if (body.title === undefined) {
        return response.status(400).json({ error: 'title missing' })
    } else if (body.url === undefined) {
        return response.status(400).json({ error: 'url missing' })
    }

    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
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
