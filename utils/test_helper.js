const Blog = require('../models/blog')


const testBlogs = [
    {
        title: "test1",
        author: "kirj1",
        url: "https://",
        likes: 5
    },
    {
        title: "test2",
        author: "kirj2",
        url: "https://2",
        likes: 2
    }
    ]

const format = (blog) => {
    return {
        id: blog._id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
        }
}
    
const nonExistingId = async () => {
    const blog = new Blog()
    await blog.save()
    await blog.remove()
    return blog._id.toString()
}
    
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(format)
}

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    var totalLikes = 0;
    for(i = 0; i < blogs.length; i++) {
        totalLikes += blogs[i].likes
    }
    return totalLikes
}

const favoriteBlog = (blogs) => {
    var favBlog = blogs[0]
    for(i=0; i<blogs.length; i++) {
        if(favBlog.likes < blogs[i].likes) {
            favBlog = blogs[i]
        }else{
        }
    }
    return favBlog
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    testBlogs,
    format,
    nonExistingId,
    blogsInDb
}