const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Emotion = mongoose.model("Emotion", mongoose.Schema({
    neutral: {
        type: Number,
        default: 0
    },
    happy: {
        type: Number,
        default: 0
    },
    sad: {
        type: Number,
        default: 0
    },
    angry: {
        type: Number,
        default: 0
    },
    fearful: {
        type: Number,
        default: 0
    },
    disgusted: {
        type: Number,
        default: 0
    },
    surprised: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        require: true
    }
}));
module.exports.insertManyEmotion = arrayOfObjects => {
    return Emotion.insertMany(arrayOfObjects);
};

module.exports.insertOneEmotion = emotionObject => {
    return Emotion.create(emotionObject);
};

module.exports.removeEmotionById = _id => {
    return Emotion.findByIdAndRemove(_id)
};

module.exports.removeEmotionsByUserId = userId => {
    return Emotion.remove({ userId });
};

module.exports.updateEmotionById = (_id, criteriaObject) => {
    return Emotion.findByIdAndUpdate(_id, criteriaObject);
};

module.exports.findOneEmotion = criteriaObject => {
    return Emotion.findOne(criteriaObject);
};

module.exports.findByIdEmotion = _id => {
    return Emotion.findById(_id);
};

module.exports.findEmotions = (criteriaObject = {}) => {
    return Emotion.find(criteriaObject);
};

module.exports.findByUserIdEmotion = userId => {
    return Emotion.find({ userId });
};

module.exports.filterEmotionsByDate = date => {
    return Emotion.find({ createdAt: date })
};
module.exports.aggregate =  arrayOfOptions => {
    return Emotion.aggregate(arrayOfOptions);
};