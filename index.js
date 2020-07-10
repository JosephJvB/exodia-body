const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const server = express()

const TwitchService = require('./twitch.service')
const twitchService = new TwitchService()

server.use(helmet())
server.use(cors())
server.use(express.json())

server.get('/ping', (req, res) => {
    res.status(200).send('pong')
})
server.use('/oauth', (req, res) => {
    console.log('oauth?')
    res.sendStatus(400)
    return
})
server.get('/webhook', (req, res) => {
    if(req.query['hub.challenge']) {
        res.send(req.query['hub.challenge'])
        console.log('hub.challenge sent')
        return
    }
    res.sendStatus(400)
})
server.post('/webhook', (req, res) => {
    try {
        console.log(JSON.stringify(req.body))
        const code = await twitchService.handleWebhook(req.body.data)
        res.sendStatus(code)
    } catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})
server.post('/callback', async (req, res) => {
    try {
        console.log(JSON.stringify(req.body))
        const code = await twitchService.onCallback(req.body)
        res.sendStatus(code)
    } catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
})

server.listen(process.env.PORT,
    () => console.log('up on port', Number(process.env.PORT)))