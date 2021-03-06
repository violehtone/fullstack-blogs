const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { format, testBlogs, nonExistingId, blogsInDb, usersInDb } = require('../utils/test_helper')

describe.only('when there is one user at db', async () => {
    beforeAll(async () => {
        await User.remove({})
        const user = new User({ username: 'root', password: 'sekret'})
        await user.save()
    })

    test(('POST succeeds with a fresh username', async () => {
        const usersBeforeOperation = await usersInDb()
        const newUser = {
            username: 'vlehtone',
            name: 'Ville Lehtonen',
            password: 'salainen',
            adult: true
        }
        await api
         .post('/api/users')
         .send(newUser)
         .expect(200)
         .expect('Content-Type', /application\/json/)

         const usersAfterOperation = await usersInDb
         expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
         const usernames = usersAfterOperation.map(u => u.username)
         expect(usernames).toContain(newUser.username)
    }))

    test('POST fails if username is already taken', async () => {
        const usersBeforeOperation = await usersInDb()
        const newUser = {
            username: 'root',
            name: 'Ville Lehtonen',
            password: 'salainen',
            adult: true
        }
        const result = await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'username must be unique'})
        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('POST fails if password is less than 2 characters long', async () => {
        const usersBeforeOperation = await usersInDb()
        const newUser = {
            username: 'vlehtone',
            name: 'Ville Lehtonen',
            password: 'a',
            adult: true
        }
        const result = await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'password must be at least 3 characters long'})
        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })
})


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

describe('deleting a blog', async () => {
    let addedBlog
    beforeAll(async () => {
        addedBlog = new Blog({
            title: "Poisto",
            author: "423424",
            url: "https://343",
            likes: 10
        })
        await addedBlog.save()
    })

    test('DELETE succeeds with proper statuscode', async () => {
        const blogsAtStart = await blogsInDb()
        await api
         .delete(`/api/blogs/${addedBlog._id}`)
         .expect(204)

        const blogsAfterOperation = await blogsInDb()
        const titles = blogsAfterOperation.map(r => r.title)
        expect(titles).not.toContain(addedBlog.title)
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })
})

afterAll(() => {
  server.close()
})