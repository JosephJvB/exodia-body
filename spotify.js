const qs = require('querystring')
const axios = require('axios')

const urls = {
    callback: 'https://jvb-exodia-server.herokuapp.com/callback',
    playing: 'https://api.spotify.com/v1/me/player/currently-playing',
    token: 'https://accounts.spotify.com/api/token',
}

class Spotify {
    constructor() {
    }

    async getCurrentPlaying() {
        try {
            const token = await this.refreshAuth()
            const r = await axios({
                method: 'get',
                url: urls.playing,
                headers: { Authorization: `Bearer ${token}` }
            })

            if(r.data)
            if(r.data.item.name)
            if(r.data.item.artists) return r.data.item.name
                + ' by '
                + r.data.item.artists.map(a => a.name).join(', ')
            else return ''
        } catch (e) {
            if(e.isAxiosError) console.error(e.response.status, e.response.data)
            else console.error(e)
            return ''
        }
    }

    async refreshAuth() {
        const params = {
            method: 'post',
            url: urls.token,
            data: qs.stringify({
                grant_type: 'refresh_token',
                refresh_token: process.env.Spotify_Refresh,
                client_id: process.env.Spotify_Id
            }),
            headers: {
                Authorization: `Basic ${process.env.Spotify_BasicAuth}`,
                ContentType: 'application/x-www-form-urlencoded'
            }
        }
        const r = await axios(params)
        return r.data.access_token
    }
}

module.exports = Spotify