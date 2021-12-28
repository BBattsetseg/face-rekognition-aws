var AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });

const rek = new AWS.Rekognition();
const client = new AWS.DynamoDB.DocumentClient();


module.exports.handler = async (event) => {
  const { key } = event.headers
  const eventParams = {
    CollectionId: "demo-rekognition",
    FaceMatchThreshold: 20,
    Image: {
      S3Object: {
        Bucket: "faceappdemo",
        Name: key,
      },
    },
    MaxFaces: 1,
  };

  const detectParams = {
    Image: {
      S3Object: {
        Bucket: "faceappdemo",
        Name: key,
      },
    },
    Attributes: ["ALL"],
  };

  const response = await rek.searchFacesByImage(eventParams).promise();
  const detectResponse = await rek.detectFaces(detectParams).promise();
  let emotion = detectResponse.FaceDetails[0].Emotions[0].Type;
  let confidence = detectResponse.FaceDetails[0].Emotions[0].Confidence;
  let similiarPic = response.FaceMatches[0].Face.ExternalImageId;
  console.log(JSON.stringify(emotion));
  console.log(JSON.stringify(confidence));
  console.log(JSON.stringify(similiarPic));

  if (detectResponse && emotion) {
    const params = {
      TableName: "results",
      Item: {
        imageKey: key,
        timestamp: new Date().toString(),
        emotion,
        confidence,
      },
    };
    const dbRes = await client.put(params).promise();
  }
  return `https://faceappdemo.s3.us-east-2.amazonaws.com/faces/${similiarPic}`;
};
