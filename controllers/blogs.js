const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlog = (blog) => {
    return {
        id: blog._id,
        title: blog.content,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    }
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(formatBlog))
  })

blogsRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        if(body.title === undefined) {
            return response.status(400).json({ error: 'title missing'})
        }else if(body.url === undefined) {
            return response.status(400).json({ error: 'url missing'})
        }

        const blog = new Blog({
            id: body._id,
            title: body.content,
            author: body.author,
            url: body.url,
            likes: body.likes === undefined ? 0 : body.likes
        })

        const savedBlog = await blog.save()
        response.json(formatBlog(blog))

    }catch (exception){
        console.log(exception)
        response.status(500).json({error: 'something went wrong ...'})
    }
})

module.exports = blogsRouter