import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blogElement

  beforeEach(() => {
    this.mockHandler = vi.fn()

    const user = {
      username: 'test username',
      name: 'test firstname lastname',
    }
  
    const blog = {
      title: 'test title',
      author: 'test author',
      url: 'test url',
      likes: 1,
    }

    blog.user = user

    blogElement = render(<Blog user={user} blog={blog} likeBlog={this.mockHandler} deleteBlog={() => {}}/>)

  })

  test('renders title and author', () => {
    const element = screen.getByText('test title test author')
    expect(element).toBeDefined()
  })
  
  test('doesnt render elements it shouldnt', () => {
    const url = screen.queryByText('text url')
    const likes = screen.queryByText('1')
    const username = screen.queryByText('test username')
    expect(url).toBeNull()
    expect(likes).toBeNull()
    expect(username).toBeNull()
  })

  test('renders all elements after being clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.queryByText('test url')
    const likes = screen.queryByText('1')
    const username = screen.queryByText('test firstname lastname')
    
    
    
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(username).toBeDefined()
  })

  test('pressing like runs callback function twice', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)
    
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(this.mockHandler.mock.calls).toHaveLength(2)
  })
})
