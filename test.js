require('dotenv').config()
// const axios = require('axios')
const Twitch = require('./twitch.service')
const s = new Twitch()

s.twitchClient.connect()
.then(async _ => {
    console.log(_)
    const r = await s.twitchClient.say('ayoitsjoevanbo', 'yoo')
    console.log(r)
})