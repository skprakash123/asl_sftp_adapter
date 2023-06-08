const express = require("express");
const app = express();

app.post("/", (req, res) => {
  // fun()
  return res.status(200).json({ data: fun() });
});
const fun = () => {
  const payload = JSON.stringify({
    "id":1,
    "fileType": "QAR",
    "country": "ASLB",
    "folderName" : "OE-IFB 20220214 144410 (RID28769)",
    "tailNumber" : "OE-IFB",
    "fileName": "---00000.FLD",
    "bucketName": "asl_integration_framework",
    "fileLocation": "https://storage.googleapis.com/asl_integration_framework/gedms/QAR/ASLB/OE-IFB 20220214 144410 (RID28769)/---00000.FLD",
  });
  const payloadBuffer = Buffer.from(payload);
  console.log("payload", payloadBuffer);
  console.log("I am new ");
  return payloadBuffer;
};

app.listen(8001);
