const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, testBlogs, nonExistingId, blogsInDb } = require('../utils/test_helper')

describe('when there are some blogs saved', async () => {

    beforeAll(async () => {
        await Blog.remove({})
        const blogObjects = testBlogs.map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)
      })

    test('blogs are returned as json', async () => {
        const blogsInDatabase = await blogsInDb()
    
        const response = await api
         .get('/api/blogs/')
         .expect(200)
         .expect('Content-Type', /application\/json/)
    
        expect(response.body.length).toBe(blogsInDatabase.length)
        const returnedTitles = response.body.map(b => b.title)
        blogsInDatabase.forEach(blog => {
            expect(returnedTitles).toContain(blog.title)
        })
    })
})

describe('adding a new blog', async () => {

    test('POST succeeds with valid data', async () => {
        const blogsAtStart = await blogsInDb()
        
        const newBlog = {
            title: "jihuu",
            author: "gfdgdf",
            url: "https://3",
            likes: 15
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const blogsAfterOperation = await blogsInDb()
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
        const titles = blogsAfterOperation.map(r => r.title)
        expect(titles).toContain('jihuu')
    })

    test('POST fails with proper statuscode if title is missing', async () => {
        const newBlog2 = {
            author: "gfdgdf",
            url: "https://3",
            likes: 15
        }

        const blogsAtStart = await blogsInDb()
        await api
         .post('/api/blogs')
         .send(newBlog2)
         .expect(400)

        const blogsAfterOperation = await blogsInDb()
        const titles = blogsAfterOperation.map(r => r.title)
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })
})

afterAll(() => {
  server.close()
})