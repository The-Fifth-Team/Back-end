const tensorFlow = require('@tensorflow/tfjs-node')
const canvas = require('canvas');
const faceapi = require('face-api.js');
const insertMany = require('../../Models/Emotion').insertMany;

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
    faceapi.nets.faceRecognitionNet.loadFromDisk('weights'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('weights'),
    faceapi.nets.ssdMobilenetv1.loadFromDisk('weights'),
    faceapi.nets.faceExpressionNet.loadFromDisk('weights')
  ]).then(start)

  function start() {
    const labeledFaceDescriptors; // get from db
    let toBeSavedtoDB = []
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    whatYouRecievFromTheFrontEnd.forEach(fd => {
      const bestMatch = faceMatcher.findBestMatch(fd.descriptor)
      toBeSavedtoDB.push({userId: bestMatch.toString(), expressions:fd.expressions})
    })
    return insertMany(toBeSavedtoDB)
  }
}
