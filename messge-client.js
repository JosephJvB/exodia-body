const AWS = require('aws-sdk')

class MessageClient {
    awsClient = null
    googleClient = null
    azureClient = null
    
    constructor() {
        this.awsClient = new AWS.SNS({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_KEY_ID,
            secretAccessKey: process.env.AWS_KEY_SECRET,
        })
        this.googleClient = null
        this.azureClient = null
    }

    startChain() {
        let chain = ['aws', /*'google', 'azure'*/]
        chain.sort(() => Math.random() - 0.5)
        console.log('chain set:', chain)
        return this[chain[0]](chain.slice(1))
    }

    aws(chain) {
        return new Promise((resolve, reject) => {
            const params = {
                Message: JSON.stringify({chain}),
                Subject: '',
                TopicArn: process.env.AWS_Topic
            }
            this.awsClient.publish(params, (err, _) => {
                if(err) reject(err)
                else resolve()
            })
        })
    }
    // google(chain) {

    // }
    // azure(chain) {

    // }
}

module.exports = MessageClient