# Blogs & Poems - Graphql API Server

Learning Graphql API by building an Simple-Mini-Blogging-API where there are 4 roles:

- Guest
- Blogger
- Poet
- Admin

**And their functionalities are:**

- Guest can Read Blogs and Poems. And also leave comments and likes. And can also read an blog's comments. And can also see like counts. And also fill out a form to be a Poet or Blogger by providing an Sample Poem/Blog
- Blogger can Write, Edit and Delete their Blogs and view their blog's comments or like counts
- Poet can Write, Edit and Delete their Poems and view their poem's comments or like counts
- Admin can Delete any Blogs or Poems, Make anyone a Poet or Blogger
- Admin can also inform Poets/Bloggers to make changes to the Poets/Bloggers Blogs

## Roadmap:

- [x] Write a basic Express-Graphql Server
- [x] Install Drizzle & Write Schema
  - [x] User
  - [x] Blog
  - [x] Poem
  - [x] Poem_like
  - [x] Poem_Comment
  - [x] Blog_like
  - [x] Blog_Comment
  - [x] Poet_blogger_request
  - [x] session
  - [x] Poem_blog_correction_request
- [x] Setup Auth
  - [x] Sign-Up
  - [x] Sign-In
  - [x] Refresh
  - [x] Logout
- [x] Write the first Mutation - CreateBlog
  - [x] Handle User Input
  - [x] Handle Zod Error
  - [x] Handle CTX
  - [x] Create new Blog & Return ID
- [x] Write the first Query - Blog & Blogs
  - [x] Handle getBlogs Query
  - [x] Handle Author Model
  - [x] Handle getBlog Query
- [ ] ...
- [ ] ...
- [ ] ...
- [ ] ...
- [ ] ...
- [ ] ...


> [!TIP]
> After finishing, See if you really need those Error Handlers or It needs to be inside the **AUTH_ROUTER**

> [!TIP]
> Don't Forget to Handle Unknown Errors after finishing the DEV