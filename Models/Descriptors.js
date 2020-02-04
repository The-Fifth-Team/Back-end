var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var descriptorSchema = new Schema({
    userId: {
        type: Number,
        required: true
    },
    front: {
        type: [Number],
        required: true
    },
    left: {
        type: [Number],
        required: true
    },
    right: {
        type: [Number],
        required: true
    }
})


const Descriptor = mongoose.model("Descriptor", descriptorSchema);

module.exports.insertMany = arrayOfObjects => {
  return Descriptor.insertMany(arrayOfObjects);
};

module.exports.insertOne = descriptor => {
  return Descriptor.create(descriptor);
};

module.exports.removeDescriptorById = _id => {
  return Descriptor.findByIdAndRemove(_id)
};

module.exports.removeDescriptorsByUserId = userId => {
  return Descriptor.remove({userId});
};

module.exports.updateDescriptorById = (_id, criteriaObject) => {
  return Descriptor.findByIdAndUpdate({ _id }, criteriaObject);
};

module.exports.findOneDescriptor = criteriaObject => {
  return Descriptor.findOne(criteriaObject);
};

module.exports.findByIdDescriptor = _id => {
  return Descriptor.findById(_id);
};

module.exports.findAllDescriptors = () => {
  return Descriptor.find({});
};

module.exports.findByUserIdDescriptor = userId => {
  return Descriptor.find({userId});
};

module.exports.filterDescriptorsByDate = date => {
  return Descriptor.find({createdAt: date})
};