const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('when there is some initial blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are four blogs', async () => {
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('the blogs contain id', async () => {
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd[0].id).toBeDefined()
    })

    test('the first blog is about react', async () => {
        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('React patterns')
    })
})

describe('when trying to add a blog', () => {
    test('a blog without title is not added', async () => {
        const newBlog = {
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
            likes: 2
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a blog without url is not added', async () => {
        const newBlog = {
            title: 'Type wars',
            author: 'Robert C. Martin',
            likes: 2
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 2
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('Type wars')
    })

    test('a blog without likes can be added', async () => {
        const newBlog = {
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        const blog = blogsAtEnd.find(b => b.title === 'TDD harms architecture')
        expect(blog.likes).toBeDefined()
        expect(blog.likes).toBe(0)
    })
})

describe('when trying to delete a blog', () => {
    test('a blog without valid id cannot be deleted but will still return 204', async () => {
        const nonExistId = await helper.nonExistingId()

        await api
            .delete(`/api/blogs/${nonExistId}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a blog with valid id can be deleted', async () => {
        const blogsAtFirst = await helper.blogsInDb()
        const blog = blogsAtFirst.find(b => b.title === 'React patterns')

        await api
            .delete(`/api/blogs/${blog.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    })

})

describe('when trying to update a blog', () => {
    test('a blog without valid id cannot be updated', async () => {
        const nonExistId = await helper.nonExistingId()
        const newBlog = {
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        }

        await api
            .put(`/api/blogs/${nonExistId}`)
            .send(newBlog)
            .expect(404)
    })

    test('a blog with valid id but with partial data can be updated', async () => {
        const newBlog = {
            title: 'Canonical string reduction',
            likes: 15
        }

        const blogsAtFirst = await helper.blogsInDb()
        const blog = blogsAtFirst.find(b => b.title === 'Canonical string reduction')

        const response = await api
            .put(`/api/blogs/${blog.id}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const updatedBlog = response.body
        expect(updatedBlog.title).toContain('Canonical string reduction')
        expect(updatedBlog.likes).toBe(15)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
