const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Emotion = mongoose.model("Emotion",mongoose.Schema({
    neutral:Number,
    angry:Number,
    disgust:Number,
    happy:Number,
    fear:Number,
    sad:Number,
    surprised:Number
}));

const createEmotion = emotion => {
    return Emotion.create(emotion);
};
const removeEmotion = _id => {
    return Emotion.findByIdAndRemove(_id)
};
const updateEmotion = (_id,criteriaObject) => {
    return Emotion.findByIdAndUpdate(_id,criteriaObject);
};
const findOneEmotion = criteriaObject => {
return Emotion.findOne(criteriaObject);
};
const findByIdEmotion = _id => {
 return Emotion.findById(_id);
};
