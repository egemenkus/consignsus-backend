const express = require("express")
const router = express.Router()
const CryptoJS = require("crypto-js")
const { dynamoClient,sendMail } = require("../dynamodb")
const { v4: uuidv4} = require("uuid");
const TABLE_NAME = "passwordReset"
verifyToken = require('../middleware/authJWT')
router.use(express.json())
const randomToken = uuidv4()


router.delete("/",(req,res)=>{
    const {query:data,body:bodyData} = req
    const resetToken=data.userToken
    const hashedNewPassword = CryptoJS.SHA256(bodyData.newPassword).toString(CryptoJS.enc.Hex)
    const tokenOwner = data.tokenOwner
    // Check userToken and newPassword input

    if(data.userToken && hashedNewPassword) {
        const Getparams = {
            TableName : TABLE_NAME,
            Key: {
                resetToken : resetToken
            },
            ConditionExpression: "attribute_exists(resetToken)",
        }
        // get user's token information
        dynamoClient.get(Getparams,(err,data)=>{
            if(err) {
                res.status(503).send(err)
            }
            else if(data.Item && data.Item.expireTime > Date.now() && data.Item.tokenOwner == tokenOwner) {
                const Item = data.Item
                // Parameters
                const Updateparams = {
                TableName : "userpasswords",
                Key: {email:Item.tokenOwner},
                UpdateExpression:"set password = :new",
                ConditionExpression:"attribute_exists(email)",
                ExpressionAttributeValues: {":new" : hashedNewPassword} }

                const deleteParams = {
                TableName:"passwordReset",
                Key: { resetToken:resetToken},
                ConditionExpression:"attribute_exists(resetToken)"}
            // Updating function
            dynamoClient.update(Updateparams,(err)=>{
                if(err) {res.status(400).send(err)}
                else{
                    // Delete function
                    dynamoClient.delete(deleteParams,(err)=>{
                        if(err) res.status(500).send(err);
                        else { res.send("Deleted successfully")}}) 
                    }})
                }
                // else-if end

            // if user token expired. This error returns
            else {
                res.status(403).send({msg:"Token is expired",status:"TOKEN_EXPIRED"})
            }
        })}})


        /* When someone enter mail and click forgot password button
        this function works. It create token information and send it.
        */
router.post("/",(req,res)=>{
    const {body:data} = req
    const params = {
        TableName: TABLE_NAME,
        Item: {
            // random token created
            resetToken: randomToken,
            // user's email
            tokenOwner:data.email,
            // Token will expire after 15 minute
            expireTime:Date.now() + 900000,
        },
    }

    if(data.email) {
        dynamoClient.put(params,(err)=>{
            if(err) {
                res.status(503).send(err)
            }else {
                sendMail(data.email,randomToken)
                res.send("Mail sent successfully")
            }
        }) }
        // if end
        else {
            res.status(400).send("You must write email")} 
})

module.exports = router
