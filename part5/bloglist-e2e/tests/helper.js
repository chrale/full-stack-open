const loginWith = async (page, username, password)  => {
  await page.getByRole('textbox', { name: 'username' }).fill(username);
  await page.getByRole('textbox', { name: 'password' }).fill(password);
  await page.getByRole('button', { name: 'login' }).click()
}

const logOut = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByRole('textbox', { name: 'title:' }).fill(title);
  await page.getByRole('textbox', { name: 'author:' }).fill(author);
  await page.getByRole('textbox', { name: 'url:' }).fill(url);
  await page.getByRole('button', { name: 'create' }).click()
}

const viewDetails = async (page, title, author) => {
  await page.getByText(`'${title}' by ${author}`).getByRole('button', { name: 'view details' }).click()
}

const likeBlog = async (page, title) => {
  await page.getByText(`Title: ${title}`).getByRole('button', { name: 'add like'}).click()
}

  
export { loginWith, logOut, createBlog, viewDetails, likeBlog }