require("dotenv").config()
const AWS = require("aws-sdk")
const postmark = require("postmark")
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION || "eu-central-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})
const sendPromise = new AWS.SES({apiVersion: '2010-12-01'})
const dynamoClient = new AWS.DynamoDB.DocumentClient()

/* const sendMail = (email,resetToken) => {
    const serverToken = "7cb446bd-51ca-4b51-9768-fcbfc3c98f19"
    let url = "http://localhost:3000/forgotPassword?userToken="
    let client = new postmark.ServerClient(serverToken)
    client.sendEmail({
        From:"egemen@consigns.us",
        To:"mert@consigns.us",
        Subject:"Şifre Yenileme",
        HtmlBody:`Şu hesap için şifre yenilemesi istedin : <b>${email}</b>\nTOKENIN BU ${url}${resetToken}`,
        TextBody:``
    })
} */
const sendMail = (email,resetToken) =>{
    var params = {
        Destination:{
            ToAddresses:[
                'egemen.utku3@gmail.com',
            ],
        },
        Message:{
            Body:{
                Html:{
                    Charset:"UTF-8",
                    Data:`${resetToken} merhaba ${email}`
                },
                Text:{
                    Charset:"UTF-8",
                    Data:"Merhaba dünya"
                },
            },
            Subject:{
                Charset:"UTF-8",
                Data:"Test email"
            }
        },
        Source:"egemen@consigns.us",
    }
    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    sendPromise.then(
        function(data) {
            console.log(data)
        }).catch(
            function(err) {
                console.log(err)
            }
        )
}


module.exports = { dynamoClient,sendMail }
