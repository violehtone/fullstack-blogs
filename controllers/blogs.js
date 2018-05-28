const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog
            .find({})
            .populate('user', { username: 1, name: 1, adult: 1 })
        response.json(blogs.map(Blog.format))
    }catch(exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
    }
  })

blogsRouter.get('/:id', async (request, response) => {
    try {
        const blog = await Blog.findById(request.params.id)

        if (blog) {
            response.json(Blog.format(blog))
        } else {
            response.status(400).end()
        }
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }catch(exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id'})
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    try {
        const token = getTokenFrom(request)
        const decodedToken = jew.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        if(body.title === undefined) {
            return response.status(400).json({ error: 'title missing'})
        }else if(body.url === undefined) {
            return response.status(400).json({ error: 'url missing'})
        }

        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes === undefined ? 0 : body.likes,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedNote._id)
        await user.save()
        
        response.json(Blog.format(blog))

    }catch (exception) {
        if (exception.name === 'JsonWebTokenError' ) {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).json({error: 'something went wrong ...'})   
        }
    }
})

module.exports = blogsRouter