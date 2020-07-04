const AWS = require('aws-sdk')

class Aws {
    constructor() {
        this.client = new AWS.SNS({ region: process.env.AWS_REGION })
    }
    sendMessage () {
        return new Promise((resolve, reject) => {
            const params = {
                Message: '',
                Subject: '',
                TopicArn: process.env.AWS_Topic
            }
            this.client.publish(params, (err, _) => {
                if(err) reject(err)
                else resolve()
            })
        })
    }
}

module.exports = {
    Aws: new Aws()
}