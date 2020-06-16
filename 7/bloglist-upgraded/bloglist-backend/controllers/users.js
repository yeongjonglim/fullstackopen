const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const body = request.body

    const saltRounds = 10

    if (body.password.length < 3) {
        throw {
            name: 'ValidationError',
            message: 'Password validation failed: password: Path `password` is shorter than the minimum allowed length (3).'
        }
    }

    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser.toJSON())
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { author: 1, likes: 1, title: 1, url: 1 })
    response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter
