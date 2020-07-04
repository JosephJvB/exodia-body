require('dotenv').config()
const axios = require('axios')


if(require.main === module) {
    (async () => {
        try {
            console.log('Subscribe script: invoked')
            const r1 = await getToken()
            const r2 = await subscribe(r1.data.access_token)
            console.log('Subscribe success:', r2.status)
        } catch (e) {
            console.error('Subscribe Failed')
            if(e.isAxiosError) {
                console.error(e.response.statusCode)
                console.error(e.response.data)
            }
            else console.error(e)
        }
    })()
}

function subscribe (token) {
    return axios({
        method: 'post',
        url: 'https://api.twitch.tv/helix/webhooks/hub',
        headers: {
            Authorization: 'Bearer ' + token,
            'Client-Id': process.env.Client_Id,
        },
        data: {
            'hub.callback': process.env.Base_Url + '/webhook',
            'hub.mode': 'subscribe',
            'hub.topic': 'https://api.twitch.tv/helix/streams?user_id='+process.env.User_Id,
            'hub.lease_seconds': 864000,
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
        url: 'https://id.twitch.tv/oauth2/token',
        params: {
            client_id: process.env.Client_Id,
            client_secret: process.env.Client_Secret,
            grant_type: 'client_credentials',
            // scope: '' // optional
        }
    })
}