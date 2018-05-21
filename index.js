const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())
app.use(bodyParser.json())

const mongoUrl = 'mongodb://violehtone:olio1@ds227740.mlab.com:27740/violehtone-blogs'
mongoose.connect(mongoUrl)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
