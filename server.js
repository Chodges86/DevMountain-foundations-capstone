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

app.get('/api/get-all/:is_purchased', controller.getAll)
app.post('/api/add-item', controller.addItem)
app.put('/api/edit', controller.editItem)
app.put('/api/purchased', controller.togglePurchased)
app.delete('/api/remove/:id/:is_purchased', controller.removeFromList)
app.get('/api/get-single-item/:id', controller.getItem)
app.post('/api/add-deleted', controller.addToDeletedTable)
app.get('/api/get-all-deleted', controller.getAllDeleted)
app.delete('/api/delete/:id', controller.deleteForever)
app.get('/api/get-single-deleted/:id', controller.getDeletedItem)
app.get('/api/preview-image/:id', controller.getPreviewImage)

app.listen(SERVER_PORT, () => console.log(`Here we go on ${SERVER_PORT}`))