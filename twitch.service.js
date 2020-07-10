const tmi = require('tmi.js')
const MessageClient = require('./messge-client')

class TwitchService {
    twitchClient = null
    interval = null
    currentMsg = null
    connected = false

    constructor() {
        const opts = {
            identity: {
                username: 'joevanbot',
                password: process.env.Twitch_Password
            },
            channels: ['ayoitsjoevanbo']
        }
        this.twitchClient = new tmi.client(opts)
        this.messageClient = new MessageClient()
    }

    async handleWebhook(data) {
        try {
            if(!data) return 400
            console.log('Stream event types:', data.map(d => d.type))
            if(data.length == 0) { // stream offline
                await this.onEnd()
                return 200
            }
            if(data[0].type == 'live') {
                await this.onStart()
                return 200
            }
            return 400
        } catch (e) {
            console.error('twitchservice.handleWebhook: error')
            console.error(e)
            return 500
        }
    }

    async onStart() {
        try {
            if(this.interval) return
            console.error('twitchservice.onStart: starting messaging interval')
            this.interval = setInterval(async () => {
                try {
                    await messageClient.startChain()
                    console.log('Interval: message sent')
                } catch (e) {
                    console.error('twitchService.interval: failed to send message')
                    console.error(e)
                }
            }, 1000 * 60)
        } catch (e) {
            console.error('twitchservice.onStart: error')
            console.error(e)
        }
    }

    async onEnd() {
        try {
            console.log('twitchservice.onEnd: closing server')
            await this.twitchClient.disconnect()
            this.connected = false
            if(this.interval) clearInterval(this.interval)
            this.interval = null
        } catch (e) {
            console.error('twitchservice.onEnd: error')
            console.error(e)
        }
    }

    async onCallback(data) {
        try {
            console.log('twitchservice.onCallback: invoked')
            if(!data.song || !data.artists) return 400
            const msg = 'Currently playing: '
            + data.song
            + ' by '
            + data.artists
            if(msg == this.currentMsg) return 200
            if(!this.connected) await this.twitchClient.connect()
            this.connected = true
            await this.twitchClient.say('ayoitsjoevanbo', msg)
            this.currentMsg = msg
            return 200
        } catch (e) {
            console.error('twitchservice.onCallback: error')
            console.error(e)
            return 500
        }
    }
}

module.exports = TwitchService