const express = require("express")
const router = express.Router()
const { dynamoClient } = require("../dynamodb")
verifyToken = require('../middleware/authJWT')
const TABLE_NAME = "docs"

router.use(express.json())

router.get("/",verifyToken,(req,res)=>{
    const { body : data }= req

    const params = {
        TableName : TABLE_NAME,
        Key: {document_id:data.docID},
        ConditionExpression: "attribute_exists(document_id)",
    }
    dynamoClient.get(params,(err,data)=>{
        if(err) {
             res.status(500).send("Document not found")
        }   else {
            const Item = data.Item
           // res.send({status:"One data successfully returned",data:Item})
           res.send(data.Item)
         }
    })
})
module.exports = router