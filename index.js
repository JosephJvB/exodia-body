require('dotenv').config()
const fs = require('fs')
const path = require('path')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const tmi = require('tmi.js')

const Spotify = require('./spotify')

const server = express()
const spotify = new Spotify()
const opts = {
    identity: {
        username: 'joevanbot',
        password: process.env.Twitch_Password
    },
    channels: ['ayoitsjoevanbo']
}
const twitch = new tmi.client(opts)

server.use(helmet())
server.use(cors())
server.use(express.json())

server.get('/ping', (req, res) => {
    res.status(200).send('pong')
})

let currentTrack = null
server.listen(process.env.PORT, async () => {
    console.log('up on port', Number(process.env.PORT))
    let [date, time] = new Date(Date.now()).toLocaleString().split(', ')
    date = date.replace(/\//gi, '-')
    const file = path.join(__dirname, 'logs', date + '.json')
    if(!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({
        [time]: []
    }))
    await twitch.connect()
    setInterval(async () => {
        const track = await spotify.getCurrentPlaying()
        if(!track) return console.log('..none playing..')
        if(track == currentTrack) return console.log('..same track..')
        await twitch.say('ayoitsjoevanbo', 'Currently playing: '+track)
        currentTrack = track
        const j = require(file)
        if(!j[time]) j[time] = []
        j[time].push(currentTrack)
        fs.writeFileSync(file, JSON.stringify(j, null, 2))
    }, 90 * 1000)
})