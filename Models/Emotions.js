const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Emotion = mongoose.model("Emotion", mongoose.Schema({
    neutral: { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
    disgust: { type: Number, default: 0 },
    happy: { type: Number, default: 0 },
    fear: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    surprised: { type: Number, default: 0 },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}));
module.exports.insertMany = arrayOfObjects => {
    Emotion.insertMany(arrayOfObjects);
};
module.exports.insertOne = emotion => {
    return Emotion.create(emotion);
};
module.exports.removeEmotion = _id => {
    return Emotion.findByIdAndRemove(_id)
};
module.exports.updateEmotion = (_id, criteriaObject) => {
    return Emotion.findByIdAndUpdate(_id, criteriaObject);
};
module.exports.findOneEmotion = criteriaObject => {
    return Emotion.findOne(criteriaObject);
};
module.exports.findByIdEmotion = _id => {
    return Emotion.findById(_id);
};
module.exports.findAllEmotions = () => {
    return Emotion.find({});
};