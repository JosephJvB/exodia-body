// require('dotenv').config()
const axios = require('axios')

const urls = {
    base: 'https://jvb-exodia-server.herokuapp.com',
    token: 'https://id.twitch.tv/oauth2/token',
    subscribe: 'https://api.twitch.tv/helix/webhooks/hub',
    streamTopic: 'https://api.twitch.tv/helix/streams',
}
const subscriptionLengthSec = 864000 // 10days


if(require.main === module) {
    // (async () => {
    //     try {
    //         console.log('Subscribe script: invoked')
    //         const r1 = await getToken()
    //         const r2 = await subscribe(r1.data.access_token)
    //         console.log('Subscribe success:', r2.status)
    //     } catch (e) {
    //         console.error('Subscribe Failed')
    //         if(e.isAxiosError) {
    //             console.error(e.response.statusCode)
    //             console.error(e.response.data)
    //         }
    //         else console.error(e)
    //     }
    // })()
}

function subscribe (token) {
    return axios({
        method: 'post',
        url: urls.subscribe,
        headers: {
            Authorization: 'Bearer ' + token,
            'Client-Id': process.env.Client_Id,
        },
        data: {
            'hub.callback': urls.base + '/webhook',
            'hub.mode': 'subscribe',
            'hub.topic': urls.streamTopic + '?user_id='+process.env.User_Id,
            'hub.lease_seconds': subscriptionLengthSec,
            // 'hub.secret': null,
        }
    })
}
/*
    response.data = {
    access_token: "<user access token>",
    refresh_token: "",
    expires_in: <number of seconds until the token expires>,
    scope: ["<your previously listed scope(s)>"],
    token_type: "bearer"
    }
*/
function getToken () {
    return axios({
        method: 'post',
        url: urls.token,
        params: {
            client_id: process.env.Client_Id,
            client_secret: process.env.Client_Secret,
            grant_type: 'client_credentials',
            // scope: '' // optional
        }
    })
}