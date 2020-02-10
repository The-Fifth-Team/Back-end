const tensorFlow = require('@tensorflow/tfjs-node');
const canvas = require('canvas');
const faceapi = require('face-api.js');
const {findAllDescriptors} = require("../../Models/Descriptors");
//const insertMany = require('../../Models/Emotion').insertMany;
//const findAllDescriptors = require('../../Models/Descriptors').findAllDescriptors

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
    faceapi.nets.faceRecognitionNet.loadFromDisk('models'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('models'),
    faceapi.nets.ssdMobilenetv1.loadFromDisk('models'),
    faceapi.nets.faceExpressionNet.loadFromDisk('models')
  ]).then(start);

  async function start() {
    let toBeSavedtoDB = [];
    //Here is where the caching system should take place, taking the data from the cache,
    const dbLabeledFaceDescriptors = await findAllDescriptors();
    //cache the dbLabeledFaceDescriptors Of not changed, of changed fetch'em from the database//
    //OR//

    const labeledFaceDescriptors = dbLabeledFaceDescriptors.map( record => {
      return new faceapi.LabeledFaceDescriptors(record.userId, [record.front, record.left, record.right])
    });

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

    //return insertMany(toBeSavedtoDB)

    return toBeSavedtoDB;
  }
};

