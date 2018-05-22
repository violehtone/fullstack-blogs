if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
    port = process.env.TEST_PORT
    mongoUrl = process.env.TEST_MONGODB_URI
}

module.exports = {
    mongoUrl,
    port
}



// const mongoUrl = 'mongodb://violehtone:olio1@ds227740.mlab.com:27740/violehtone-blogs'
