require("dotenv").config();
const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = process.env.AWS_REGION_CODE;
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_SECRET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  },
});

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
