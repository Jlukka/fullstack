const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser123',
        password: 'secret1234'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Test 2',
        username: 'test2',
        password: 'test2'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in')
    const usernameInput = await page.getByPlaceholder('enter username')
    const passwordInput = await page.getByPlaceholder('enter password')
    const loginButton = await page.getByRole('button', {name: 'login'})
    await expect(locator).toBeVisible()
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(loginButton).toBeVisible()
  })

  describe('login', () => {
    test('succeeds when given correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser123', 'secret1234')
      
      await expect(page.getByText('Test User logged in')).toBeVisible()
      await expect(page.getByText('logged in as testuser123')).toBeVisible()

    })

    test('fails when given incorrect credentials', async ({ page }) => {
      await loginWith(page, 'testuser123', 'secret1233')
      
      await expect(page.getByText('Test User logged in')).toBeHidden()
      await expect(page.getByText('invalid username or password')).toBeVisible()

    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser123', 'secret1234')

    })

    test('new blog can be created', async ({ page }) => {
      await expect(page.getByText('testing web apps playwright')).toBeHidden()

      await createBlog(page, 'testing web apps', 'playwright', 'placeholder')

      await expect(page.getByText('testing web apps playwright')).toBeVisible()
    })

    describe('blogs added by user exists in database', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'testing web apps', 'playwright', 'placeholder')
        await createBlog(page, 'testing web apps part 2', 'playwright', 'placeholder')
        await createBlog(page, 'end to end testing', 'playwright', 'placeholder')
      })
      test('a blog can be liked', async ({ page }) => {
        const secondBlog = await page.getByText('testing web apps part 2 playwright').locator('..')
        await expect(page.getByText('1')).toHaveCount(0)
        const viewButton = await secondBlog.getByRole('button',  {name: 'view'}).click()
        const likeButton = await secondBlog.getByRole('button',  {name: 'like'}).click()
        await expect(page.getByText('1')).toBeVisible()
      })  
      test('a blog can be deleted', async ({ page }) => {
        const thirdBlog = await page.getByText('end to end testing playwright').locator('..')
        const viewButton = await thirdBlog.getByRole('button',  {name: 'view'}).click()
        page.on('dialog', dialog => dialog.accept())
        const deleteButton = await thirdBlog.getByRole('button',  {name: 'delete'}).click()
        await expect(page.getByText('end to end testing playwright')).toHaveCount(0)
      })
      test('only blog creator can see delete button', async ({ page }) => {
        await page.getByText('log out').click()
        await loginWith(page, 'test2', 'test2')
        await expect(page.getByText('Test 2 logged in')).toBeVisible()
        await expect(page.getByText('logged in as test2')).toBeVisible()

        const thirdBlog = await page.getByText('end to end testing playwright').locator('..')
        const viewButton = await thirdBlog.getByRole('button',  {name: 'view'}).click()
        await expect(thirdBlog.getByRole('button',  {name: 'delete'})).toHaveCount(0)
        
      })
      test.only('blogs are shown sorted by most liked', async ({ page }) => {
        const secondBlog = await page.getByText('testing web apps part 2 playwright').locator('..')
        const thirdBlog = await page.getByText('end to end testing playwright').locator('..')
        
        await secondBlog.getByRole('button',  {name: 'view'}).click()
        await likeBlog(page, secondBlog)
        await secondBlog.getByRole('button',  {name: 'unview'}).click()

        await thirdBlog.getByRole('button',  {name: 'view'}).click()
        await likeBlog(page, thirdBlog)
        await likeBlog(page, thirdBlog)
        await thirdBlog.getByRole('button',  {name: 'unview'}).click()

        const blogs = await page.getByText('playwright view').all()

        await expect(blogs[0]).toContainText('end to end testing playwright')
        await expect(blogs[1]).toContainText('testing web apps part 2 playwright')
        await expect(blogs[2]).toContainText('testing web apps playwright')
      })
    })
  })
})