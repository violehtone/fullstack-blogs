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

module.exports = {
    dummy,
    totalLikes
}