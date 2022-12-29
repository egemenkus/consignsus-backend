require("dotenv").config()
const express = require("express")
const router = express.Router()
const CryptoJS = require("crypto-js")
const { dynamoClient } = require("../dynamodb")
var jwt = require("jsonwebtoken");
const TABLE_NAME = process.env.TABLE_NAME || "userpasswords"

// It's necessary for take input succesfully with express.
router.use(express.json())

router.post("/", (req, res) => {
    const { body: data } = req

    // Password hashing with crypto-js
    const hashedPassword = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.Hex)

    const params = {
        TableName: TABLE_NAME,
        Key: {
            email: data.email,
        },

        // Get password of account linked to email, if email is exists.
        ConditionExpression: "attribute_exists(email)",
    }

    dynamoClient.get(params, (err, data) => {
        if (err) {
            res.status(401).send("Wrong password!")
        } else {
            if (data.Item.password == hashedPassword) {
                var token = jwt.sign({
                    email:data.Item.email,
                },`${process.env.API_SECRET}`,{
                    expiresIn:"6h"
                })
                const params = {
                    TableName: TABLE_NAME,
            
                    Key: {
                        email: data.Item.email,
                    },
            
                    // If password of account linked to email, is equal to input of oldPassword
                    // set of the password of account linked to email, to input of newPassword
                    UpdateExpression: "set userToken = :newToken",
                    // Do some assignment for the expressions above
                    ExpressionAttributeValues: {
                        ":newToken": token,
                    },
                }
                dynamoClient.update(params,(err)=>{
                    if(err) res.status(500).send(err)
                    else {
                        res.status(200).send({msg:"Login successfully",data:token})
                    }
                })
                
            } else {
                res.status(403).send("Wrong password!")
            }
        }
    })
})

module.exports = router
