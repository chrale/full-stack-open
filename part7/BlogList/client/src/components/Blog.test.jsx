import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';

test('blog renders title and url by default', () => {
  const blog = {
    likes: 1,
    author: 'Matti meikäläinen',
    title: 'Kissan tarinat',
    url: 'www.kissa.fi',
  };

  const { container } = render(<Blog blog={blog} />);
  const div = container.querySelector('.blog');
  expect(div).toHaveTextContent('Kissan tarinat');
  expect(div).toHaveTextContent('Matti meikäläinen');
  expect(div).not.toHaveTextContent('1');
  expect(div).not.toHaveTextContent('www.kissa.fi');
});

test('blog renders URL and likes after clicking button', async () => {
  const blog = {
    likes: 1,
    author: 'Matti meikäläinen',
    title: 'Kissan tarinat',
    url: 'www.kissa.fi',
    user: {
      name: 'MattiM',
    },
  };
  const { container } = render(<Blog blog={blog} />);
  const viewDetailsButton = container.querySelector('.viewDetails');
  const user = userEvent.setup();
  await user.click(viewDetailsButton);
  const div = container.querySelector('.blog');
  expect(div).toHaveTextContent('Url: www.kissa.fi');
  expect(div).toHaveTextContent('Likes: 1');
});

test('like button is clicked twice', async () => {
  const blog = {
    likes: 1,
    author: 'Matti meikäläinen',
    title: 'Kissan tarinat',
    url: 'www.kissa.fi',
    user: {
      name: 'MattiM',
    },
  };
  const user = userEvent.setup();
  const mockHandler = vi.fn();
  const { container } = render(<Blog blog={blog} addLike={mockHandler} />);
  const viewDetailsButton = container.querySelector('.viewDetails');

  await user.click(viewDetailsButton);

  const addLikeButton = container.querySelector('.addLike');

  await user.click(addLikeButton);
  await user.click(addLikeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
