const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const clients = require('./messge-clients')

const server = express()

server.use(helmet())
server.use(cors())
server.use(express.json())

let interval = null

server.get('/ping', (req, res) => {
    res.status(200).send('pong')
})
server.use('/oauth', (req, res) => {
    console.log('oauth?')
    console.log('params', JSON.stringify(req.params))
    console.log('body', JSON.stringify(req.body))
    res.sendStatus(200)
    return
})
// /webhook?hub.challenge=nk62QPa2y7Tz63fecSP69Sca1l4vtWI_v7fl8o88&hub.lease_seconds=864000&hub.mode=subscribe&hub.topic=https%3A%2F%2Fapi.twitch.tv%2Fhelix%2Fstreams%3Fuser_id%3D61614939
server.use('/webhook', (req, res) => {
    console.log('Stream event received:',)
    console.log('params', JSON.stringify(req.params))
    console.log('body', JSON.stringify(req.body))
    if(req.params['hub.challenge']) {
        console.log('challenge received')
        res.send(req.params['hub.challenge'])
        return
    }
    if(req.body.data.length == 0) { // stream offline
        if(interval) clearInterval(interval)
        interval = null
        // save to db?
        res.sendStatus(200)
        return
    }

    console.log('Stream event types:', req.body.data.map(d => d.type))

    if(req.body.data[0].type == 'live') {
        if(interval) clearInterval(interval)
        interval = setInterval(() => {
            // await clients.Aws.sendMessage()
            console.log('Interval: message sent')
        }, 1000 * 60)
        res.sendStatus(200)
        return
    }

    res.sendStatus(200)
    return
})
/*{
    "data": [
      {
        "id": "0123456789",
        "user_id": "5678",
        "user_name": "wjdtkdqhs",
        "game_id": "21779",
        "community_ids": [],
        "type": "live",
        "title": "Best Stream Ever",
        "viewer_count": 417,
        "started_at": "2017-12-01T10:09:45Z",
        "language": "en",
        "thumbnail_url": "https://link/to/thumbnail.jpg"
      }
    ]
}*/

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log('up on port', PORT))