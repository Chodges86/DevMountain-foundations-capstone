require('dotenv').config()
const express = require('express')
const cors = require('cors')

// For some reason I had to install this or else my req.body would be undefined
const bp = require('body-parser')

const { SERVER_PORT } = process.env
const controller = require('./controller')

const app = express()

app.use(cors())
app.use(bp.json())
app.use(bp.urlencoded({extended: true}))

app.get('/api/get-all', controller.getAll)
app.post('/api/add-item', controller.addItem)
app.put('/api/edit', controller.editItem)

app.listen(SERVER_PORT, () => console.log(`Here we go on ${SERVER_PORT}`))