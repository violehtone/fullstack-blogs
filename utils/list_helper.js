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
    favoriteBlog
}