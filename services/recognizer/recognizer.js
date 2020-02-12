const tensorFlow = require('@tensorflow/tfjs-node');
const canvas = require('canvas');
const faceapi = require('face-api.js');
const {findAllDescriptors} = require("../../Models/Descriptors");
require('../../SERVER_CACHE_MEMORY');

const {
  Canvas,
  Image,
  ImageData
} = canvas;
faceapi.env.monkeyPatch({
  Canvas,
  Image,
  ImageData
});

module.exports = whatYouRecievFromTheFrontEnd => {
  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk('models1'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('models1'),
    faceapi.nets.ssdMobilenetv1.loadFromDisk('models1'),
    faceapi.nets.faceExpressionNet.loadFromDisk('models1')
  ])
      .then(start())
      .catch(err => {
        console.log(err)
      });

  async function start() {
    let toBeSavedtoDB = [];
    let labeledFaceDescriptors;
    if (SERVER_CACHE_MEMORY.has(process.env.DESCRIPTOR_KEY)) {
      labeledFaceDescriptors = SERVER_CACHE_MEMORY.get(process.env.DESCRIPTOR_KEY);
    } else {
      const dbLabeledFaceDescriptors = await findAllDescriptors();
      const labeledFaceDescriptors = dbLabeledFaceDescriptors.map( record => {
        let front = new Float32Array(128);
        let left = new Float32Array(128);
        let right = new Float32Array(128);
        // console.log(record);
        record.front.forEach((elm, i) => {
          front[i] = elm;
        });
        record.left.forEach((elm, i) => {
          left[i] = elm;
        });
        record.right.forEach((elm, i) => {
          right[i] = elm;
        });
        record.userId = record.userId.toString();
        // console.log(typeof record.userId)
        return new faceapi.LabeledFaceDescriptors(record.userId.toString(), [front, left, right])
      });
      SERVER_CACHE_MEMORY.set(process.env.DESCRIPTOR_KEY, labeledFaceDescriptors); // maybe adds some time for how long it stays in cache, Expiry Date
    }
    let faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    whatYouRecievFromTheFrontEnd.forEach(fd => {
      let obj = {};
      const bestMatch = faceMatcher.findBestMatch(fd.descriptor);
      obj.neutral = fd.expressions.neutral;
      obj.happy = fd.expressions.happy;
      obj.sad = fd.expressions.sad;
      obj.angry = fd.expressions.angry;
      obj.fearful = fd.expressions.fear;
      obj.disgusted = fd.expressions.disgust;
      obj.surprised = fd.expressions.surprised;
      obj.userId = bestMatch.toString();
      toBeSavedtoDB.push(obj)
    });
    return toBeSavedtoDB;
  }
};

