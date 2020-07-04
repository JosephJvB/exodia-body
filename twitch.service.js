const tmi = require('tmi.js')
const messageClients = require('./messge-clients')

class TwitchService {
    twitchClient = null
    interval = null
    currentMsg = null

    constructor() {
        const opts = {
            identity: {
                username: 'joevanbot',
                password: process.env.Twitch_Password
            },
            channels: ['ayoitsjoevanbo']
        }
        this.twitchClient = new tmi.client(opts)
    }

    handleWebhook(data) {
        if(!data) return 400
        console.log('Stream event types:', req.body.data.map(d => d.type))
        if(data.length == 0) { // stream offline
            this.onEnd()
            return 200
        }
        if(req.body.data[0].type == 'live') {
            this.onStart()
            return 200
        }

        return 400
    }

    onStart() {
        if(this.interval) return
        console.log('=== Stream Online ===')
        this.twitchClient.connect()
        this.interval = setInterval(async () => {
            await messageClients.Aws.sendMessage()
            console.log('Interval: message sent')
        }, 1000 * 60)
    }
    
    onEnd() {
        console.log('=== Stream Offline ===')
        this.twitchClient.disconnect()
        if(this.interval) clearInterval(this.interval)
        this.interval = null
    }

    onCallback(data) {
        if(!data.song || !data.artists) return 400
        const msg = 'Currently playing: '
        + data.song
        + ' by '
        + data.artists
        if(msg == this.currentMsg) return
        this.twitchClient.say('ayoitsjoevanbo', msg)
        this.currentMsg = msg

        return 200
    }
}

module.exports = TwitchService