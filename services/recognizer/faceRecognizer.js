// require('@tensorflow/tfjs-node');
const canvas = require('canvas');
const faceapi = require('face-api.js');
const { findAllDescriptors } = require("../../Models/Descriptors");
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

module.exports = async descriptorArray => {
    return await Promise.all([
            faceapi.nets.faceRecognitionNet,
            faceapi.nets.faceLandmark68Net,
            faceapi.nets.ssdMobilenetv1,
            faceapi.nets.faceExpressionNet
        ])
        .then(async() => await start())
        .catch(err => {
            console.log(err)
        });

    async function start() {
        let labeledFaceDescriptors;
        if (SERVER_CACHE_MEMORY[process.env.DESCRIPTOR_KEY]) {
            labeledFaceDescriptors = SERVER_CACHE_MEMORY[process.env.DESCRIPTOR_KEY];
        } else {
            const dbLabeledFaceDescriptors = await findAllDescriptors();
            labeledFaceDescriptors = dbLabeledFaceDescriptors.map(record => {
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
            SERVER_CACHE_MEMORY[process.env.DESCRIPTOR_KEY] = labeledFaceDescriptors;
        }

        let faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.45);
        const bestMatch = faceMatcher.findBestMatch(descriptorArray);
        if (bestMatch.toString().toLowerCase() !== "unknown") {
            return bestMatch.toString(); //_id
        }
        return null;
    }
};