const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, logOut, createBlog, viewDetails, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Esimerkki Käyttäjä',
        username: 'kayttaja',
        password: 'qwerty'       
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Toinen Käyttäjä',
        username: 'kayttaja2',
        password: 'salasana'       
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'kayttaja', 'qwerty')
      
      const successDiv = await page.locator('.success')
      await expect(successDiv).toContainText('login successful')
      await expect(successDiv).toHaveCSS('border-style', 'solid')
      await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

      await expect(page.getByText('Esimerkki Käyttäjä logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'kayttaja', 'salasana')
  
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')    
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Esimerkki Käyttäjä logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'kayttaja', 'qwerty')
      await createBlog(page, 'Rotan novelli', 'Rottaliini', 'www.rotat.fi')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Kissan tarinat', 'Matikainen', 'www.kissat.fi')

      await expect(page.getByText("'Kissan tarinat' by Matikainen")).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await viewDetails(page, "Rotan novelli", "Rottaliini")
      await likeBlog(page, "Rotan novelli")
      await likeBlog(page, "Rotan novelli")

      await expect(page.getByText("new like added to Rotan novelli")).toBeVisible()
      await expect(page.getByText("Likes: 2")).toBeVisible()
   })
    
    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'Kissan tarinat', 'Matikainen', 'www.kissat.fi')
      await viewDetails(page, "Kissan tarinat", "Matikainen")
      page.on('dialog', dialog => dialog.accept())
      await page.getByText("Title: Kissan tarinat").getByRole('button', { name: 'remove blog'}).click()

      await expect(page.getByText("blog Kissan tarinat deleted successfully")).toBeVisible()
      await expect(page.getByText("'Kissan tarinat' by Matikainen")).not.toBeVisible()
      await expect(page.getByText("Title: Kissan tarinat")).not.toBeVisible()
    })
    
    test('delete button is visible only for own added blogs', async ({ page }) => {
      // only the user who added the blog sees the blog's delete button
      await viewDetails(page, "Rotan novelli", "Rottaliini")
      await expect(page.getByText("Title: Rotan novelli").getByRole('button', { name: 'remove blog'})).toBeVisible()
      
      await logOut(page)

      await loginWith(page, 'kayttaja2', 'salasana')
      await viewDetails(page, "Rotan novelli", "Rottaliini")
      await expect(page.getByText("Title: Rotan novelli").getByRole('button', { name: 'remove blog'})).toBeHidden()
    })

    test('blogs are arranged according to the likes', async ({ page }) => {
      await createBlog(page, 'Koiran muistot', 'Mäyräkoira', 'www.koirat.fi')
      await createBlog(page, 'Hiiren katkut', 'Hiirulainen', 'www.hiiret.fi')

      await viewDetails(page, "Rotan novelli", "Rottaliini")
      await viewDetails(page, "Koiran muistot", "Mäyräkoira")
      await viewDetails(page, "Hiiren katkut", "Hiirulainen")

      const blogLocators = await page.locator('.blog').all()
      await expect(blogLocators[0].getByText("Title: Rotan novelli")).toBeVisible()
      await expect(blogLocators[1].getByText("Title: Koiran muistot")).toBeVisible()
      await expect(blogLocators[2].getByText("Title: Hiiren katkut")).toBeVisible()

      await likeBlog(page, 'Rotan novelli')
      await likeBlog(page, 'Koiran muistot')
      await likeBlog(page, 'Koiran muistot')
      await likeBlog(page, 'Hiiren katkut')
      await likeBlog(page, 'Hiiren katkut')
      await likeBlog(page, 'Hiiren katkut')

      const likedBlogLocators = await page.locator('.blog').all()
      await expect(likedBlogLocators[2].getByText("Title: Rotan novelli")).toBeVisible()
      await expect(likedBlogLocators[1].getByText("Title: Koiran muistot")).toBeVisible()
      await expect(likedBlogLocators[0].getByText("Title: Hiiren katkut")).toBeVisible()
    })
  })

})