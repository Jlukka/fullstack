const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})

    const newUser = {
      username: "testUser123",
      password: "secret"
    }

    await api
    .post('/api/users')
    .send(newUser)
          
    response = await api
      .post('/api/login')
      .send({"username": "testUser123","password": "secret"})
    token = response.body.token

    

})

describe('blogs API', () => {
  describe('GET method', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('correct number of blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
            
    })

    test('first blog title is correct', async () => {
      const response = await api.get('/api/blogs')

      const contents = response.body

      const firstBlog = contents[0]

      assert.strictEqual(firstBlog.title, helper.initialBlogs[0].title)
    })
    
    test('id field is called id', async () => {
      const response = await api.get('/api/blogs')

      const contents = response.body

      const firstBlog = contents[0]

      assert.strictEqual(firstBlog.id, helper.initialBlogs[0]._id)
    })
  })
  describe('POST method', () => {
    describe('using correct data', () => {
      const newBlog = {
        title: "testing testing",
        author: "testing author",
        url: "test.test",
        likes: 0
      }
      
      test('creating new blog increases blog count', async () => {
        await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
          .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      }) 
      test('newly created blog title can be found in db', async () => {
        await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
          .expect('Content-Type', /application\/json/)

          const blogsAtEnd = await helper.blogsInDb()
          const titles = blogsAtEnd.map(b => b.title)
          assert(titles.includes('testing testing'))
      })
    })
    describe('using invalid data', () => {
      const correctBlog = {
        author: "testing author 2",
        title: "testing testing",
        author: "testing author",
        url: "test.test",
      }
      const noLikesBlog = {
        title: "testing testing",
        author: "testing author",
        url: "test.test",
      }
      const noTitleBlog = {
        author: "testing author 2",
        url: "test.test",
        likes: 0
      }
      const noUrlBlog = {
        title: "testing testing",
        author: "testing author",
        likes: 0
      }
      test('providing no likes amount defaults to 0', async () => {
        await api
          .post('/api/blogs')
          .send(noLikesBlog)
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
          .expect('Content-Type', /application\/json/)

          const blogsAtEnd = await helper.blogsInDb()
          savedBlog = blogsAtEnd[6]
          assert.strictEqual(savedBlog.likes, 0)
      })
      test('providing no title causes 400 bad request', async () => {
        await api
          .post('/api/blogs')
          .send(noTitleBlog)
          .set('Authorization', `Bearer ${token}`)
          .expect(400)
      })
      test('providing no url causes 400 bad request', async () => {
        await api
          .post('/api/blogs')
          .send(noUrlBlog)
          .set('Authorization', `Bearer ${token}`)
          .expect(400)
      })
      test('providing no auth token causes 401 unauth', async () => {
        await api
          .post('/api/blogs')
          .send(correctBlog)
          .expect(401)
      })
    })
  })
  describe("DELETE method", () => {
    test('deleting a blog decreases amount of blogs in db', async () => {
      const userBlog = {
        title: "testing testing auth",
        author: "testing author",
        url: "test.test",
        likes: 0
      }

      const response = await api
          .post('/api/blogs')
          .send(userBlog)
          .set('Authorization', `Bearer ${token}`)

      const blogsAtStart = await helper.blogsInDb()

      const blogToDelete = response.body


      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })
    test('deleteted blog title is no longer in db', async () => {
      const userBlog = {
        title: "testing testing auth",
        author: "testing author",
        url: "test.test",
        likes: 0
      }

      const response = await api
        .post('/api/blogs')
        .send(userBlog)
        .set('Authorization', `Bearer ${token}`)

      const blogToDelete = response.body


      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(b => b.title)

      assert(!titles.includes(blogToDelete.title))
    })
  })
  describe("PUT method", async () => {
    test('update doesnt change blog count', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToEdit = blogsAtStart[0]

      const editedBlog = {title: 'edit testing', author: 'edit author', url: "test.test", likes: 0}

      await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(editedBlog)
        .expect(200)
      
      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    })
    test('updated title can be found in db', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToEdit = blogsAtStart[0]

      const editedBlog = {title: 'edit testing', author: 'edit author', url: "test.test", likes: 0}

      await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(editedBlog)
        .expect(200)
      
      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(b => b.title)

      assert(titles.includes(editedBlog.title))
    })
    test('after update old title cant be found in db', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToEdit = blogsAtStart[0]

      const editedBlog = {title: 'edit testing', author: 'edit author', url: "test.test", likes: 0}

      await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(editedBlog)
        .expect(200)
      
      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(b => b.title)

      assert(!titles.includes(blogToEdit.title))
    })     
  })
})
describe("users API", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', name: 'root', passwordHash })

    await user.save()
  })
  describe('creation with correct information', () => {

    test('creation increases number of users in db', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'testing123',
        name: 'Testing User',
        password: 'password',
      }

      await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    })
    test('created username exists in db', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'testing123',
        name: 'Testing User',
        password: 'password',
      }

      await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      const usernames = usersAtEnd.map(user => user.username)
      assert(usernames.includes(newUser.username))
    })
  })
  describe('creation with incorrect information', () => {
    describe('invalid username', () => {
      test('using existing username fails 400', async () => {
        
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'root',
          name: 'Testing User',
          password: 'password',
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
      test('providing no username fails 400', async () => {

        const usersAtStart = await helper.usersInDb()


        const newUser = {
          name: 'Testing User',
          password: 'password',
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
      test('providing too short username fails 400', async () => {

        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'te',
          name: 'Testing User',
          password: 'password',
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
    })
    describe('invalid password', () => {
      test('providing no password fails 400', async () => {

        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'testing',
          name: 'Testing User'
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
      test('providing too short password fails 400', async () => {

        const usersAtStart = await helper.usersInDb()


        const newUser = {
          username: 'testing2',
          name: 'Testing User',
          password: 'te'
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
    })
  })
})
after(async () => {
    await mongoose.connection.close()
})