const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clusterSchema = new Schema({
    array: {
        type: [String],
        required: true
    },
    id: {
        type: Number,
        required: true
    }
});

const Cluster = mongoose.model("Cluster", clusterSchema);

module.exports.insertManyClusters = arrayOfObjects => {
  return Cluster.insertMany(arrayOfObjects);
};

module.exports.insertOneCluster = cluster => {
  return Cluster.create(cluster);
};

module.exports.removeClusterById = _id => {
  return Cluster.findByIdAndRemove(_id)
};

module.exports.updateClusterById = (_id, criteriaObject) => {
  return Cluster.findByIdAndUpdate({ _id }, criteriaObject);
};

module.exports.findOneCluster = criteriaObject => {
  return Cluster.findOne(criteriaObject);
};

module.exports.findByIdCluster = _id => {
  return Cluster.findById(_id);
};

module.exports.findAllClusters = () => {
  return Cluster.find({});
};


module.exports.filterClustersByDate = date => {
  return Cluster.find({createdAt: date})
};
