const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const descriptorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectID,
        ref: "User",
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
});


const Descriptor = mongoose.model("Descriptor", descriptorSchema);

module.exports.insertManyDescriptor = arrayOfObjects => {
  return Descriptor.insertMany(arrayOfObjects);
};

module.exports.insertOneDescriptor = descriptor => {
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


`type Descriptor {
    id: ID!
    front: [Float!]!
    left: [Float!]!
    right: [Float!]!
    userId: String!
    createdAt: String
  }`
