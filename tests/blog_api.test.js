const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const testBlogs = [
        {
            title: "test1",
            author: "kirj1",
            url: "https://",
            likes: 5
        },
        {
            title: "test2",
            author: "kirj2",
            url: "https://2",
            likes: 2
        }
        ]

beforeAll(async () => {
    await Blog.remove({})
    console.log("Cleared blogs")
    const blogObjects = testBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    console.log('Saved test-blogs', blogObjects)
  })

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('adding a blog', async () => {
    const newBlog = {
        title: "dsada",
        author: "gfdgdf",
        url: "https://3",
        likes: 15
    }

    await api
     .post('/api/blogs')
     .send(newBlog)
     .expect(200)
     .expect('Content-Type', /application\/json/)

     const response = await api
        .get('/api/blogs')
    
     expect(response.body.length).toBe(testBlogs.length + 1)
})

afterAll(() => {
  server.close()
})