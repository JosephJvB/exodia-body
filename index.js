const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const clients = require('./messge-clients')

const server = express()

server.use(helmet())
server.use(cors())

let interval = null

server.get('/ping', (req, res) => {
    res.status(200).send('pong')
})
server.post('/start', async (req, res) => {
    interval = setInterval(() => {
        // await clients.Aws.sendMessage()
        console.log('message sent')
    }, 1000 * 60)
    res.sendStatus(200)
})
server.post('/end', (req, res) => {
    if(interval) clearInterval(interval)
    interval = null
    res.sendStatus(200)
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log('up on port', PORT))