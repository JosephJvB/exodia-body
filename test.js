require('dotenv').config()
const axios = require('axios')
// const Twitch = require('./twitch.service')
// const s = new Twitch()

// s.twitchClient.connect()
// .then(async _ => {
//     console.log(_)
//     const r = await s.twitchClient.say('ayoitsjoevanbo', 'yoo')
//     console.log(r)
// })
axios({
    method: 'post',
    url: 'https://jvb-exodia-server.herokuapp.com/webhook',
    data: {
        // data: [{type: 'live'}]
        data: []
    }
})