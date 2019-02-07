const dummy = (blogs) => (1)

const totalLikes = (blogs) => {
  return blogs.map(blog => blog.likes).reduce((total, num) => total + num, 0)
}

const favoriteBlog = (blogs) => {
  const maxLikes = blogs.reduce((max, blog) => blog.likes > max ? blog.likes : max, 0)
  return blogs.find(blog => blog.likes === maxLikes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}