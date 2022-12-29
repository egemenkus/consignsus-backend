const express = require("express")
const router = express.Router()
const { dynamoClient } = require("../dynamodb")
verifyToken = require('../middleware/authJWT')
const TABLE_NAME = "documents"

router.use(express.json())

router.get("/",(req,res)=>{
    const owner_email = req.query.owner_email
    const params = {
        TableName :TABLE_NAME,
        FilterExpression:'email = :email',
        ExpressionAttributeValues: {
            ':email':owner_email
        }
    }
    dynamoClient.scan(params,(err,data)=>{
        if(err) {
            res.status(500).send(err)
        }else {
            res.send(data)
        }
    })
})

module.exports=router