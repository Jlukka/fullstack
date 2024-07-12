const loginWith = async (page, username, password) => {
  await page.getByPlaceholder('enter username').fill(username)
  await page.getByPlaceholder('enter password').fill(password)
  await page.getByRole('button', {name: 'login'}).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', {name: 'new blog'}).click()
  await page.getByPlaceholder('write title here').fill(`${title}`)
  await page.getByPlaceholder('write author here').fill(`${author}`)
  await page.getByPlaceholder('write url here').fill(`${url}`)
  await page.getByRole('button', {name: 'create new blog'}).click()
  await page.getByRole('button', {name: 'create new blog'}).waitFor({state:'hidden'})

}

const likeBlog = async (page, blog) => {
  let likes = await blog.getByText(/^[0-91]* like$/).textContent()
  likes = Number(likes.replace(' like',''))

  const likeButton = await blog.getByRole('button',  {name: 'like'}).click()
  const expectedLikes = String(likes+1)

  await blog.getByText(expectedLikes).waitFor()
}

export { loginWith, createBlog, likeBlog }