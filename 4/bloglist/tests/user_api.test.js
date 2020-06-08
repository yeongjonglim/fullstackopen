const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()

        await Blog.deleteMany({})
        const blogObjects = helper.initialBlogs.map(blog => (
            new Blog({
                ...blog,
                userId: user.id
            })
        ))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'voltendron',
            name: 'YJ L',
            password: 'helloworld'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'toor'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('query success with proper statuscode and message if username already taken', async () => {
        const result = await api
            .post('/api/blogs')
            .send()
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})

