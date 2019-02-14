const _ = require('lodash')

const dummy = (blogs) => (1)

const totalLikes = (blogs) => {
  return blogs.map(blog => blog.likes).reduce((total, num) => total + num, 0)
}

const favoriteBlog = (blogs) => {
  const maxLikes = blogs.reduce((max, blog) => blog.likes > max ? blog.likes : max, 0)
  return blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  const authors = _.uniq(blogs.map(blog => blog.author))
  const authorBlogs = authors
    .map(author => ({
      author: author,
      blogs: (blogs
        .filter(x => x.author === author).length)
    }))
  const blogCounts = (authorBlogs.map(author => author.blogs))
  const maxBlogs = blogCounts.reduce((res, current) => res < current ? current : res)
  const maxAuthor = authorBlogs.find(author => author.blogs === maxBlogs)
  return maxAuthor
}

const mostLikes = (blogs) => {
  const authors = _.uniq(blogs.map(blog => blog.author))
  const authorLikes = authors
    .map(author => ({
      author: author,
      likes: blogs
        .reduce((res, current) => current.author === author ? res + current.likes : res, 0)
    }))
  return authorLikes.reduce((res, cur) => cur.likes > res.likes ? cur : res, { likes: 0 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}