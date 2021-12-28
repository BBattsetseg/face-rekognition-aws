var AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });
const rek = new AWS.Rekognition();

module.exports.handler = async (event) => {
  console.log(JSON.stringify(event));
  const { Records } = event;
  const { s3 } = Records[0];
  const {key} = s3.object
  const id = key.split("/")[1];
  console.log(id)
  var params = {
    CollectionId: "demo-rekognition",
    DetectionAttributes: [],
    ExternalImageId: id,
    Image: {
      S3Object: {
        Bucket: "faceappdemo",
        Name: key
      }
    }
  };
  const a = await rek.indexFaces(params).promise();
  console.log(a);
  return "success";
};
