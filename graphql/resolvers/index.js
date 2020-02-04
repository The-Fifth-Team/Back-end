const { insertUser, deleteUser, getUsers, updateOneUser } = require('../../Models/User');
const { createAdmin, findOneByIdAndRemove, findAllAdmins, findOneByIdAndUpdate } = require('../../Models/Admin');
const { insertOne, removeEmotionById, findAllEmotions, updateEmotionById, filterEmotionsByDate } = require('../../Models/Emotion');
const { insertManyClusters, insertOneCluster, removeClusterById, updateClusterById, findOneCluster, findByIdCluster, findAllClusters, filterClustersByDate } = require('../../Models/Cluster');
const { insertOneDescriptor, removeDescriptorById, findAllDescriptors, findDescriptorByUserId, filterDescriptorsByDate } = require('../../Models/Descriptors');

module.exports = resolvers = {
    Query: {
      users: async () => {
        return await getUsers()
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },
      admins: () => {
        return findAllAdmins()
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },
      filterEmotions: (_, { date }) => {
        return filterEmotionsByDate(date)
          .then(result => {
            return result
          })
      },
      clusters: () => {
        return findAllClusters()
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },
      filterClusters: (date) => {
        return filterClustersByDate(date)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },
      descriptors: () => {
        return findAllDescriptors()
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },
      findDescriptorByUserId: () => {
        return findDescriptorByUserId()
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },

      filterDescriptors: (date) => {
        return filterDescriptorsByDate(date)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      }

    },

    Mutation: {
      addUser: (_, { firstName, lastName, password, age, gender } ) => {
        return insertUser( { firstName, lastName, password, age, gender } )
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },
      removeUser: async (_, { userId } ) => {
        return await deleteUser(userId)
          .then(result => {
            return result;
          })
          .catch(err => {
            return err;
          })
      },
      updateUser: (_, {userId, obj}) => {
        return updateOneUser(userId, obj)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },

      // Admin Part --> to be refactored Laster on
      addAdmin: (_, {firstName, lastName, email, password}) => {
        return createAdmin({ firstName, lastName, email, password })
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },
      removeAdmin: (_, { _id }) => {
        return findOneByIdAndRemove( _id )
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err
          })
      },
      updateAdmin: (_, {_id, obj}) => {
        return findOneByIdAndUpdate(_id, obj)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },
      // Emotion Part --> to be refactored later on
      addEmotion: (_, { neutral, angry, disgust, happy, fear, sad, surprised, userId }) => {
        return insertOne({ neutral, angry, disgust, happy, fear, sad, surprised, userId })
          .then(result => {
            return result
          })
          .catch(err => {
            throw err;
          })
      },
      removeEmotion: (_, { _id }) => {
        return removeEmotionById(_id)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },
      updateEmotion: (_, {_id, obj}) => {
        return updateEmotionById(_id, obj)
          .then(result => {
            // TOOD: may be done later on
          })
          .catch(err => {
            return err;
          })
      },

      // Cluster Part
      addClusters: (_, arrayOfObjects) => {
        return insertManyClusters(arrayOfObjects)
          .then(result => {
            return result
          })
          .catch(err => {
            throw err;
          })
      },
      removeCluster: (_, { _id }) => {
        return removeClusterById(_id)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },
      // Descriptor Part
      addDescriptor: (_, descriptor) => {
        return insertOneDescriptor(descriptor)
          .then(result => {
            return result
          })
          .catch(err => {
            throw err;
          })
      },
      removeDescriptor: (_, { _id }) => {
        return removeDescriptorById(_id)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      }


    }
  };
