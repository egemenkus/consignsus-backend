require("dotenv").config()
const express = require("express")
const router = express.Router()
const CryptoJS = require("crypto-js")
const { dynamoClient } = require("../dynamodb")
var jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authJWT")
const TABLE_NAME = process.env.TABLE_NAME || "userpasswords"

// It's necessary for take input succesfully with express.
router.use(express.json())

// documentID UserEmail => tokenden çekilir. 
router.post("/",verifyToken,(req,res)=>{
    const {body:data}=req


})

module.exports = router