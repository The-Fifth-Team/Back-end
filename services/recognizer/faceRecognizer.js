const tensorFlow = require('@tensorflow/tfjs-node')
const canvas = require('canvas');
const faceapi = require('face-api.js');
//const insertMany = require('../../Models/Emotion').insertMany;
//const findAllDescriptors = require('../../Models/Descriptors').findAllDescriptors

const {
  Canvas,
  Image,
  ImageData
} = canvas
faceapi.env.monkeyPatch({
  Canvas,
  Image,
  ImageData
})

export default function (whatYouRecievFromTheFrontEnd) {
  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk('models'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('models'),
    faceapi.nets.ssdMobilenetv1.loadFromDisk('models'),
    faceapi.nets.faceExpressionNet.loadFromDisk('models')
  ]).then(start)

  function async start() {
    var toBeSavedtoDB = []
    const dbLabeledFaceDescriptors = await findAllDescriptors();

    labeledFaceDescriptors = dbLabeledFaceDescriptors.map((record) => {
      return new faceapi.LabeledFaceDescriptors(record.userId, [record.front, record.left, record.right])
    })

    var faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

    const bestMatch = faceMatcher.findBestMatch(whatYouRecievFromTheFrontEnd)
    if (bestMatch.toString().toLowerCase() !== "unknown"){
      return bestMatch.toString()
    }
    return new Error("User not identified")
    }
    return false
  }
}
