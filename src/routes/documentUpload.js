const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { dynamoClient } = require("../dynamodb");
const AWS = require("aws-sdk");
const router = express.Router();

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION || "eu-central-1",
  },
});

// It's necessary for take input succesfully with express.
router.use(express.json());

const fileStorage = multer.memoryStorage();

const upload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 100000000,
    files: 1,
  },
});

// Post endpoint for single file upload
router.post("/", upload.single("file"), (req, res) => {
  file = req.file;

  const fileID = uuidv4();

  const key = "documents/" + fileID;

  const { signers, owner_email } = req.body;

  if (file.mimetype != "application/pdf") {
    return res.status(400).send("File must be a PDF");
  } else {

    // Upload file to S3
    s3.upload(
      {
        Bucket: "kushynoda-bucket",
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
      (err, data) => {
        if (err) {
          return res.status(500).send(`Error creating document: ${err}`);
        }

        // Create a new document in DynamoDB
        const params = {
          TableName: process.env.DOCUMENTS_TABLE_NAME,
          Item: {
            document_id: fileID,
            created_at: new Date().toString(),
            document_name: file.originalname.slice(0, -4), // Remove .pdf
            owner_email: owner_email,
            signers: signers,
            signedUsers:null,
          },
        };
        // Put document in DynamoDB
        dynamoClient.put(params, (err) => {
          if (err) {
            res.status(500).send(`Error creating document: ${err}`);
          } else {
            res.send("Document uploaded successfully");
          }
        });
      }
    );
  }
});

module.exports = router;
