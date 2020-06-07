const _ = require('lodash');

const dummy = () => {
    return 1
}

const totalLikes = blogs => blogs.reduce((sum, curr) => sum + curr.likes, 0)

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return {}
    }
    return blogs.reduce((mostLikedBlog, curr) => curr.likes >= mostLikedBlog.likes ? curr : mostLikedBlog, { 'likes': 0 })
}

const mostBlogs = blogs => {
    if (blogs.length === 0) {
        return {}
    }
    const authorBlog = _.map(_.countBy(blogs, 'author'), (val, key) => ({ 'author': key, 'blogs': val }))
    const maxAuthor = _.maxBy(authorBlog, 'blogs')

    return maxAuthor
}

const mostLikes = blogs => {
    if (blogs.length === 0) {
        return {}
    }
    const sumAuthorLikes = _(blogs)
        .groupBy('author')
        .map((objects, key) => ({
            'author': key,
            'likes': _.sumBy(objects, 'likes') }))
        .value();

    const maxLikesAuthor = _.maxBy(sumAuthorLikes, 'likes')

    return maxLikesAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
