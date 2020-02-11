const tensorFlow = require('@tensorflow/tfjs-node');
const canvas = require('canvas');
const faceapi = require('face-api.js');
const {findAllDescriptors} = require("../../Models/Descriptors");
//const insertMany = require('../../Models/Emotion').insertMany;
//const findAllDescriptors = require('../../Models/Descriptors').findAllDescriptors
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
    faceapi.nets.faceRecognitionNet.loadFromDisk('models'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('models'),
    faceapi.nets.ssdMobilenetv1.loadFromDisk('models'),
    faceapi.nets.faceExpressionNet.loadFromDisk('models')
  ]).then(start);

  async function start() {
    let toBeSavedtoDB = [];
    let labeledFaceDescriptors;

    if(SERVER_CACHE_MEMORY.has(process.env.DESCRIPTOR_KEY)){
      labeledFaceDescriptors = SERVER_CACHE_MEMORY.get(process.env.DESCRIPTOR_KEY);
    }else{
      const dbLabeledFaceDescriptors = await findAllDescriptors();
      labeledFaceDescriptors = dbLabeledFaceDescriptors.map( record => {
        return new faceapi.LabeledFaceDescriptors(record.userId, [record.front, record.left, record.right])
      });
      SERVER_CACHE_MEMORY.set(process.env.DESCRIPTOR_KEY, labeledFaceDescriptors); // maybe adds some time for how long it stays in cache
    }

    let faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    // cache the dbLabeledFaceDescriptors Of not changed, of changed fetch'em from the database//
    // OR //
    // we can just, cache the  labeledFaceDescriptors and save time mapping over all the records


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

