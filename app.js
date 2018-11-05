const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.set('view engine', 'ejs')
app.set('views', './views')

app.use('/node_modules', express.static('./node_modules'))
app.use(bodyParser.urlencoded({ extended: false} ))

const indexR = require('./router/index.js')
app.use(indexR)

const userR = require('./router/user.js')
app.use(userR)

app.listen(80, () => {
    console.log('http://127.0.0.1')
})