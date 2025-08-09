import { render, screen } from '@testing-library/react';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('new blog is created to the blog form', async () => {
  const mockHandler = vi.fn();
  const { container } = render(<BlogForm createBlog={mockHandler} />);

  const user = userEvent.setup();

  const titleInput = container.querySelector('#title-input');
  const authorInput = container.querySelector('#author-input');
  const urlInput = container.querySelector('#url-input');

  const createBlogButton = container.querySelector('.addBlog');

  await user.type(titleInput, 'Testi otsikko');
  await user.type(authorInput, 'Testi kirjoittaja');
  await user.type(urlInput, 'Testi osoite');
  await user.click(createBlogButton);

  expect(mockHandler.mock.calls).toHaveLength(1);

  expect(mockHandler.mock.calls[0][0].title).toBe('Testi otsikko');
  expect(mockHandler.mock.calls[0][0].author).toBe('Testi kirjoittaja');
  expect(mockHandler.mock.calls[0][0].url).toBe('Testi osoite');
});
