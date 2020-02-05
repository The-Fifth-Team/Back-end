const { insertUser, deleteUser, getUsers, updateOneUser } = require('../../Models/User');
const { createAdmin, findOneByIdAndRemove, findAllAdmins, findOneByIdAndUpdate } = require('../../Models/Admin');
const { insertOneEmotion, removeEmotionById, findAllEmotions, updateEmotionById, filterEmotionsByDate } = require('../../Models/Emotion');
const { insertOneDescriptor } = require('../../Models/Descriptors.js');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dwtaamxgn",
    api_key: "431917237583798",
    api_secret: "LC0J_kCL5lesk7PVP1KviAgHSKY"
});


module.exports = resolvers = {
    Query: {
        users: async() => {
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
        addUser(_, { firstName, lastName, password, age, gender }) {
            return insertUser({ firstName, lastName, password, age, gender })
                .then(result => {
                    return result;
                })
                .catch(err => {
                    throw err;
                })
        },
        async removeUser(_, { userId }) {
            return await deleteUser(userId)
                .then(result => {
                    return result;
                })
                .catch(err => {
                    return err;
                })
        },
        updateUser(_, { userId, obj }) {
            return updateOneUser(userId, obj)
                .then(result => {
                    return result;
                })
                .catch(err => {
                    throw err;
                })
        },
        // Admin Part --> to be refactored Laster on
        addAdmin(_, { firstName, lastName, email, password }) {
            return createAdmin({ firstName, lastName, email, password })
                .then(result => {
                    return result;
                })
                .catch(err => {
                    throw err;
                })
        },
        removeAdmin(_, { _id }) {
            return findOneByIdAndRemove(_id)
                .then(result => {
                    return result;
                })
                .catch(err => {
                    throw err
                })
        },
        updateAdmin(_, { _id, obj }) {
            return findOneByIdAndUpdate(_id, obj)
                .then(result => {
                    return result;
                })
                .catch(err => {
                    throw err;
                })
        },
        // Emotion Part --> to be refactored later on
        addEmotion(_, { neutral, angry, disgust, happy, fear, sad, surprised, userId }) {
            return insertOneEmotion({ neutral, angry, disgust, happy, fear, sad, surprised, userId })
                .then(result => {
                    return result
                })
                .catch(err => {
                    throw err;
                })
        },
        removeEmotion(_, { _id }) {
            return removeEmotionById(_id)
                .then(result => {
                    return result;
                })
                .catch(err => {
                    throw err;
                })
        },
        updateEmotion(_, { _id, obj }) {
            return updateEmotionById(_id, obj)
                .then(result => {
                    // TOOD: may be done later on
                })
                .catch(err => {
                    return err;
                })
        },
        // filterEmotions: (_, { date }) => {
        //   return filterEmotionsByDate(date)
        //     .then(result => {
        //       return result
        //     })
        // }
        async uploadUser(parent, { data }) {
            const { filename, createReadStream } = await data.photo;
            try {
                const result = await new Promise((resolve, reject) => {
                    createReadStream().pipe(
                        cloudinary.uploader.upload_stream((error, result) => {
                            if (error) {
                                reject(error)
                            }
                            resolve(result)
                        })
                    )
                });
                // const newPhoto = { filename, path: result.secure_url };
                // photos.push(newPhoto);
                let user = await insertUser({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    age: data.age,
                    gender: data.gender,
                    photoUrl: result.secure_url
                });
                if (!user) {
                    return new Error("Error with inserting the user")
                }

                //the code for inserting the Descriptor should follow here


            } catch (err) {
                console.error(err);
                return err;
            }
        },
        async addClusters(_, arrayOfObjects) {
            return insertManyClusters(arrayOfObjects)
                .then(result => {
                    return result
                })
                .catch(err => {
                    throw err;
                })
        },
        async removeCluster(_, { _id }) {
            return removeClusterById(_id)
                .then(result => {
                    return result;
                })
                .catch(err => {
                    throw err;
                })
        },
        async addDescriptor(_, descriptor) {
            return insertOneDescriptor(descriptor)
                .then(result => {
                    return result
                })
                .catch(err => {
                    throw err;
                })
        },
        async removeDescriptor(_, { _id }) {
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