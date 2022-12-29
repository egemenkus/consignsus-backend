require("dotenv").config()
const express = require("express")
const router = express.Router()
const CryptoJS = require("crypto-js")
const { dynamoClient } = require("../dynamodb")
var jwt = require("jsonwebtoken");
const TABLE_NAME ="users"

router.use(express.json())

router.get("/",(req,res)=>{
    const user_email = req.query.user_email
    const params = {
        TableName: TABLE_NAME,
        Key: {
            email_id: user_email,
        },
    
        // Get password of account linked to email, if email is exists.
        ConditionExpression: "attribute_exists(email)",
    }
    dynamoClient.get(params,(err,data)=>{
        if(err) {
            res.status(500).send(err)
        }else{
            res.send(data.Item)
        }
    })
})
module.exports=router
