require("dotenv").config()
const express = require("express")
const router = express.Router()
const CryptoJS = require("crypto-js")
const { dynamoClient } = require("../dynamodb")
verifyToken = require('../middleware/authJWT')

const TABLE_NAME = process.env.TABLE_NAME || "userpasswords"

// It's necessary for take input succesfully with express.
router.use(express.json())

// HTTP Method is Patch because we want to update a portion of the resource.
router.patch("/", verifyToken,(req, res) => {
    const { body: data } = req

    // Old and New passwords hashing with crypto-js.
    const hashedOldPassword = CryptoJS.SHA256(data.oldPassword).toString(CryptoJS.enc.Hex)
    const hashedNewPassword = CryptoJS.SHA256(data.newPassword).toString(CryptoJS.enc.Hex)
    const params = {
        TableName: TABLE_NAME,

        Key: {
            email: req.user.email,
        },

        // If password of account linked to email, is equal to input of oldPassword
        // set of the password of account linked to email, to input of newPassword
        UpdateExpression: "set password = :new, set updated_on = :newDate",
        ConditionExpression: "password = :old",

        // Do some assignment for the expressions above
        ExpressionAttributeValues: {
            ":old": hashedOldPassword,
            ":new": hashedNewPassword,
            ":newDate": new Date.now().toString(),
        },
    }

    dynamoClient.update(params, (err) => {
        if (err) res.send("Wrong old password")//res.status(401).send("Wrong old password! or E-mail does not exists!")
        else res.send("Password changed succesfully!")
    })
})

module.exports = router
