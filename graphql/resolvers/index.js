const cloudinary = require('cloudinary').v2;
const User = require('../../Models/User');
const Admin = require('../../Models/Admin');
const Emotion = require('../../Models/Emotion');
const Descriptor = require('../../Models/Descriptors');
cloudinary.config({
    cloud_name: "dwtaamxgn",
    api_key: "431917237583798",
    api_secret: "LC0J_kCL5lesk7PVP1KviAgHSKY"
});
const resolvers = {
    Mutation: {
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
                Descriptor.insertOneDescriptor({
                    userId: user._id,
                    front: data.descriptors[0],
                    left: data.descriptors[1],
                    right: data.descriptors[2]
                });
                console.log("Inserted Successful");
            } catch (err) {
                console.error(err);
                return err;
            }
        },
        addAdmin(_, { data }) {
            return Admin.createAdmin(data);
        }
    },
    Query: {
        getAllUsers() {
            return User.findUsers();
        },
        getAllAdmins() {
            return Admin.findAdmins();
        },
        async getPeriodEmotions(_, { startDate, endDate }) {
            let startDateInt = parseInt(startDate);
            let endDateInt = parseInt(endDate);
            startDate = new Date(startDateInt);
            endDate = new Date(endDateInt);
            let startDateIntNext;
            let arrayOfEmotions;
            let emotionsTotal = [];
            let assertCounter = 0;
            const MAX_ITERATIONS = 10000;
            let neutralStatus = {
                maxValue: 0,
                minValue: 1,
                startAtMax: "",
                endAtMax: "",
                startAtMin: "",
                endAtMin: ""
            };
            let happyStatus = {
                maxValue: 0,
                minValue: 1,
                startAtMax: "",
                endAtMax: "",
                startAtMin: "",
                endAtMin: ""
            };
            let sadStatus = {
                maxValue: 0,
                minValue: 1,
                startAtMax: "",
                endAtMax: "",
                startAtMin: "",
                endAtMin: ""
            };
            let angryStatus = {
                maxValue: 0,
                minValue: 1,
                startAtMax: "",
                endAtMax: "",
                startAtMin: "",
                endAtMin: ""
            };
            let fearfulStatus = {
                maxValue: 0,
                minValue: 1,
                startAtMax: "",
                endAtMax: "",
                startAtMin: "",
                endAtMin: ""
            };
            let disgustedStatus = {
                maxValue: 0,
                minValue: 1,
                startAtMax: "",
                endAtMax: "",
                startAtMin: "",
                endAtMin: ""
            };
            let surprisedStatus = {
                maxValue: 0,
                minValue: 1,
                startAtMax: "",
                endAtMax: "",
                startAtMin: "",
                endAtMin: ""
            };
            while ((startDateInt < endDateInt) && (assertCounter < MAX_ITERATIONS)) {
                assertCounter++;
                startDateIntNext = new Date((startDateInt + (15 * 60 * 1000)));
                arrayOfEmotions = await Emotion.findEmotions({ "createdAt": { "$gte": startDate, "$lt": startDateIntNext } });
                for (let i = 0; i < arrayOfEmotions.length; i++) {
                    if (arrayOfEmotions[i]["neutral"] > neutralStatus.maxValue) {
                        neutralStatus.maxValue = arrayOfEmotions[i]["neutral"];
                        neutralStatus.startAtMax = startDate.getTime().toString();
                        neutralStatus.endAtMax = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["neutral"] < neutralStatus.minValue) {
                        neutralStatus.minValue = arrayOfEmotions[i]["neutral"];
                        neutralStatus.startAtMin = startDate.getTime().toString();
                        neutralStatus.endAtMin = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["happy"] > happyStatus.maxValue) {
                        happyStatus.maxValue = arrayOfEmotions[i]["happy"];
                        happyStatus.startAtMax = startDate.getTime().toString();
                        happyStatus.endAtMax = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["happy"] < happyStatus.minValue) {
                        happyStatus.minValue = arrayOfEmotions[i]["happy"];
                        happyStatus.startAtMin = startDate.getTime().toString();
                        happyStatus.endAtMin = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["sad"] > sadStatus.maxValue) {
                        sadStatus.maxValue = arrayOfEmotions[i]["sad"];
                        sadStatus.startAtMax = startDate.getTime().toString();
                        sadStatus.endAtMax = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["sad"] < sadStatus.minValue) {
                        sadStatus.minValue = arrayOfEmotions[i]["sad"];
                        sadStatus.startAtMin = startDate.getTime().toString();
                        sadStatus.endAtMin = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["angry"] > angryStatus.maxValue) {
                        angryStatus.maxValue = arrayOfEmotions[i]["angry"];
                        angryStatus.startAtMax = startDate.getTime().toString();
                        angryStatus.endAtMax = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["angry"] < angryStatus.minValue) {
                        angryStatus.minValue = arrayOfEmotions[i]["angry"];
                        angryStatus.startAtMin = startDate.getTime().toString();
                        angryStatus.endAtMin = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["fearful"] > fearfulStatus.maxValue) {
                        fearfulStatus.maxValue = arrayOfEmotions[i]["fearful"];
                        fearfulStatus.startAtMax = startDate.getTime().toString();
                        fearfulStatus.endAtMax = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["fearful"] < fearfulStatus.minValue) {
                        fearfulStatus.minValue = arrayOfEmotions[i]["fearful"];
                        fearfulStatus.startAtMin = startDate.getTime().toString();
                        fearfulStatus.endAtMin = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["disgusted"] > disgustedStatus.maxValue) {
                        disgustedStatus.maxValue = arrayOfEmotions[i]["disgusted"];
                        disgustedStatus.startAtMax = startDate.getTime().toString();
                        disgustedStatus.endAtMax = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["disgusted"] < disgustedStatus.minValue) {
                        disgustedStatus.minValue = arrayOfEmotions[i]["disgusted"];
                        disgustedStatus.startAtMin = startDate.getTime().toString();
                        disgustedStatus.endAtMin = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["surprised"] > surprisedStatus.maxValue) {
                        surprisedStatus.maxValue = arrayOfEmotions[i]["surprised"];
                        surprisedStatus.startAtMax = startDate.getTime().toString();
                        surprisedStatus.endAtMax = startDateIntNext.getTime().toString();
                    }
                    if (arrayOfEmotions[i]["surprised"] < surprisedStatus.minValue) {
                        surprisedStatus.minValue = arrayOfEmotions[i]["surprised"];
                        surprisedStatus.startAtMin = startDate.getTime().toString();
                        surprisedStatus.endAtMin = startDateIntNext.getTime().toString();
                    }
                }
                emotionsTotal.push(arrayOfEmotions);
                startDateInt = startDateIntNext;
            }
            let finalResult = [];
            let neutralSum = 0;
            let happySum = 0;
            let sadSum = 0;
            let angrySum = 0;
            let fearfulSum = 0;
            let disgustedSum = 0;
            let surprisedSum = 0;
            for (let i = 0; i < emotionsTotal.length; i++) {
                for (let j = 0; j < emotionsTotal[i]; j++) {
                    neutralSum = neutralSum += emotionsTotal[i][j]["neutral"];
                    happySum = happySum += emotionsTotal[i][j]["happy"];
                    sadSum = sadSum += emotionsTotal[i][j]["sad"];
                    angrySum = angrySum += emotionsTotal[i][j]["angry"];
                    fearfulSum = fearfulSum += emotionsTotal[i][j]["fearful"];
                    disgustedSum = disgustedSum += emotionsTotal[i][j]["disgusted"];
                    surprisedSum = surprisedSum += emotionsTotal[i][j]["surprised"];
                }
                finalResult.push([(neutralSum / emotionsTotal[i]), (happySum / emotionsTotal[i]), (sadSum / emotionsTotal[i]), (angrySum / emotionsTotal[i]), (fearfulSum / emotionsTotal[i]), (disgustedSum / emotionsTotal[i]), (surprisedSum / emotionsTotal[i])])
            }
            return {
                averages: finalResult,
                status: [neutralStatus, happyStatus, sadStatus, angryStatus, fearfulStatus, disgustedStatus, surprisedStatus]
            }
        }
    }
};

module.exports = resolvers;









// const cloudinary = require('cloudinary').v2;
// const User = require('../../Models/User');
// const Admin = require('../../Models/Admin');
// const Emotion = require('../../Models/Emotion');
// const Descriptor = require('../../Models/Descriptors');
// cloudinary.config({
//     cloud_name: "dwtaamxgn",
//     api_key: "431917237583798",
//     api_secret: "LC0J_kCL5lesk7PVP1KviAgHSKY"
// });
// const resolvers = {
//     Mutation: {
//         async uploadUser(parent, { data }) {
//             const { filename, createReadStream } = await data.photo;
//             try {
//                 const result = await new Promise((resolve, reject) => {
//                     createReadStream().pipe(
//                         cloudinary.uploader.upload_stream((error, result) => {
//                             if (error) {
//                                 reject(error)
//                             }
//                             resolve(result)
//                         })
//                     )
//                 });
//                 let user = await insertUser({
//                     firstName: data.firstName,
//                     lastName: data.lastName,
//                     age: data.age,
//                     gender: data.gender,
//                     photoUrl: result.secure_url
//                 });
//                 if (!user) {
//                     return new Error("Error with inserting the user")
//                 }
//                 insertOneDescriptor({
//                     userId: user._id,
//                     front: data.descriptors[0],
//                     left: data.descriptors[1],
//                     right: data.descriptors[2]
//                 });
//                 console.log("Inserted Successful");
//             } catch (err) {
//                 console.error(err);
//                 return err;
//             }
//         },
//         addAdmin(_, { data }) {
//             return Admin.createAdmin(data);
//         }
//     },
//     Query: {
//         getAllUsers() {
//             return User.findUsers();
//         },
//         getAllAdmins() {
//             return Admin.findAdmins();
//         },
//         async getPeriodEmotions(_, { startDate, endDate }) {
//             let startDateInt = parseInt(startDate);
//             let endDateInt = parseInt(endDate);
//             startDate = new Date(startDateInt);
//             endDate = new Date(endDateInt);
//             let startDateIntNext;
//             let arrayOfEmotions;
//             let emotionsTotal = [];
//             let assertCounter = 0;
//             const MAX_ITERATIONS = 10000;
//             let neutralStatus = {
//                 maxValue: 0,
//                 minValue: 1,
//                 startAtMax: "",
//                 endAtMax: "",
//                 startAtMin: "",
//                 endAtMin: ""
//             };
//             let happyStatus = {
//                 maxValue: 0,
//                 minValue: 1,
//                 startAtMax: "",
//                 endAtMax: "",
//                 startAtMin: "",
//                 endAtMin: ""
//             };
//             let sadStatus = {
//                 maxValue: 0,
//                 minValue: 1,
//                 startAtMax: "",
//                 endAtMax: "",
//                 startAtMin: "",
//                 endAtMin: ""
//             };
//             let angryStatus = {
//                 maxValue: 0,
//                 minValue: 1,
//                 startAtMax: "",
//                 endAtMax: "",
//                 startAtMin: "",
//                 endAtMin: ""
//             };
//             let fearfulStatus = {
//                 maxValue: 0,
//                 minValue: 1,
//                 startAtMax: "",
//                 endAtMax: "",
//                 startAtMin: "",
//                 endAtMin: ""
//             };
//             let disgustedStatus = {
//                 maxValue: 0,
//                 minValue: 1,
//                 startAtMax: "",
//                 endAtMax: "",
//                 startAtMin: "",
//                 endAtMin: ""
//             };
//             let surprisedStatus = {
//                 maxValue: 0,
//                 minValue: 1,
//                 startAtMax: "",
//                 endAtMax: "",
//                 startAtMin: "",
//                 endAtMin: ""
//             };
//             while ((startDateInt < endDateInt) && (assertCounter < MAX_ITERATIONS)) {
//                 assertCounter++;
//                 startDateIntNext = new Date((startDateInt + (15 * 60 * 1000)));
//                 arrayOfEmotions = await Emotion.findEmotions({ "createdAt": { "$gte": startDate, "$lt": startDateIntNext } });
//                 for (let i = 0; i < arrayOfEmotions.length; i++) {
//                     if (arrayOfEmotions[i]["neutral"] > neutralStatus.maxValue) {
//                         neutralStatus.maxValue = arrayOfEmotions[i]["neutral"];
//                         neutralStatus.startAtMax = startDate.getTime().toString();
//                         neutralStatus.endAtMax = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["neutral"] < neutralStatus.minValue) {
//                         neutralStatus.minValue = arrayOfEmotions[i]["neutral"];
//                         neutralStatus.startAtMin = startDate.getTime().toString();
//                         neutralStatus.endAtMin = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["happy"] > happyStatus.maxValue) {
//                         happyStatus.maxValue = arrayOfEmotions[i]["happy"];
//                         happyStatus.startAtMax = startDate.getTime().toString();
//                         happyStatus.endAtMax = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["happy"] < happyStatus.minValue) {
//                         happyStatus.minValue = arrayOfEmotions[i]["happy"];
//                         happyStatus.startAtMin = startDate.getTime().toString();
//                         happyStatus.endAtMin = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["sad"] > sadStatus.maxValue) {
//                         sadStatus.maxValue = arrayOfEmotions[i]["sad"];
//                         sadStatus.startAtMax = startDate.getTime().toString();
//                         sadStatus.endAtMax = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["sad"] < sadStatus.minValue) {
//                         sadStatus.minValue = arrayOfEmotions[i]["sad"];
//                         sadStatus.startAtMin = startDate.getTime().toString();
//                         sadStatus.endAtMin = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["angry"] > angryStatus.maxValue) {
//                         angryStatus.maxValue = arrayOfEmotions[i]["angry"];
//                         angryStatus.startAtMax = startDate.getTime().toString();
//                         angryStatus.endAtMax = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["angry"] < angryStatus.minValue) {
//                         angryStatus.minValue = arrayOfEmotions[i]["angry"];
//                         angryStatus.startAtMin = startDate.getTime().toString();
//                         angryStatus.endAtMin = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["fearful"] > fearfulStatus.maxValue) {
//                         fearfulStatus.maxValue = arrayOfEmotions[i]["fearful"];
//                         fearfulStatus.startAtMax = startDate.getTime().toString();
//                         fearfulStatus.endAtMax = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["fearful"] < fearfulStatus.minValue) {
//                         fearfulStatus.minValue = arrayOfEmotions[i]["fearful"];
//                         fearfulStatus.startAtMin = startDate.getTime().toString();
//                         fearfulStatus.endAtMin = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["disgusted"] > disgustedStatus.maxValue) {
//                         disgustedStatus.maxValue = arrayOfEmotions[i]["disgusted"];
//                         disgustedStatus.startAtMax = startDate.getTime().toString();
//                         disgustedStatus.endAtMax = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["disgusted"] < disgustedStatus.minValue) {
//                         disgustedStatus.minValue = arrayOfEmotions[i]["disgusted"];
//                         disgustedStatus.startAtMin = startDate.getTime().toString();
//                         disgustedStatus.endAtMin = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["surprised"] > surprisedStatus.maxValue) {
//                         surprisedStatus.maxValue = arrayOfEmotions[i]["surprised"];
//                         surprisedStatus.startAtMax = startDate.getTime().toString();
//                         surprisedStatus.endAtMax = startDateIntNext.getTime().toString();
//                     }
//                     if (arrayOfEmotions[i]["surprised"] < surprisedStatus.minValue) {
//                         surprisedStatus.minValue = arrayOfEmotions[i]["surprised"];
//                         surprisedStatus.startAtMin = startDate.getTime().toString();
//                         surprisedStatus.endAtMin = startDateIntNext.getTime().toString();
//                     }
//                 }
//                 emotionsTotal.push(arrayOfEmotions);
//                 startDateInt = startDateIntNext;
//             }
//             let finalResult = [];
//             let neutralSum = 0;
//             let happySum = 0;
//             let sadSum = 0;
//             let angrySum = 0;
//             let fearfulSum = 0;
//             let disgustedSum = 0;
//             let surprisedSum = 0;
//             for (let i = 0; i < emotionsTotal.length; i++) {
//                 for (let j = 0; j < emotionsTotal[i]; j++) {
//                     neutralSum = neutralSum += emotionsTotal[i][j]["neutral"];
//                     happySum = happySum += emotionsTotal[i][j]["happy"];
//                     sadSum = sadSum += emotionsTotal[i][j]["sad"];
//                     angrySum = angrySum += emotionsTotal[i][j]["angry"];
//                     fearfulSum = fearfulSum += emotionsTotal[i][j]["fearful"];
//                     disgustedSum = disgustedSum += emotionsTotal[i][j]["disgusted"];
//                     surprisedSum = surprisedSum += emotionsTotal[i][j]["surprised"];
//                 }
//                 finalResult.push([(neutralSum / emotionsTotal[i]), (happySum / emotionsTotal[i]), (sadSum / emotionsTotal[i]), (angrySum / emotionsTotal[i]), (fearfulSum / emotionsTotal[i]), (disgustedSum / emotionsTotal[i]), (surprisedSum / emotionsTotal[i])])
//             }
//             return {
//                 averages: finalResult,
//                 status: [neutralStatus, happyStatus, sadStatus, angryStatus, fearfulStatus, disgustedStatus, surprisedStatus]
//             }
//         }
//     }
// };
//
// module.exports = resolvers;
//
//
//
//
// // const {removeDescriptorById} = require("../../Models/Descriptors");
// // const {removeClusterById, insertManyClusters} = require("../../Models/Cluster");
// // const { insertUser, deleteUser, getUsers, updateOneUser } = require('../../Models/User');
// // const { createAdmin, findOneByIdAndRemove, findAllAdmins, findOneByIdAndUpdate } = require('../../Models/Admin');
// // const { insertOneEmotion, removeEmotionById, findAllEmotions, updateEmotionById, filterEmotionsByDate } = require('../../Models/Emotion');
// // const { insertOneDescriptor } = require('../../Models/Descriptors.js');
// // const cloudinary = require('cloudinary').v2;
// //
// // cloudinary.config({
// //     cloud_name: "dwtaamxgn",
// //     api_key: "431917237583798",
// //     api_secret: "LC0J_kCL5lesk7PVP1KviAgHSKY"
// // });
// //
// // module.exports = {
// //     Query: {
// //         users () {
// //             return getUsers()
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         admins() {
// //             return findAllAdmins()
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         filterEmotions (_, { date }){
// //             return filterEmotionsByDate(date)
// //                 .then(result => {
// //                     return result
// //                 })
// //         },
// //         clusters() {
// //             return findAllClusters()
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         filterClusters(date){
// //             return filterClustersByDate(date)
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         descriptors(){
// //             return findAllDescriptors()
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         findDescriptorByUserId(){
// //             return findDescriptorByUserId()
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         filterDescriptors(date){
// //             return filterDescriptorsByDate(date)
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         async getPeriodEmotions(_, { startDate, endDate }) {
// //             let startDateInt = parseInt(startDate);
// //             let endDateInt = parseInt(endDate);
// //             startDate = new Date(startDateInt);
// //             endDate = new Date(endDateInt);
// //             let arrayOfEmotions;
// //             let emotionsTotal = [];
// //             let assertCounter = 0;
// //             const MAX_ITERATIONS = 10000;
// //             let neutralStatus = {
// //                 maxValue: 0,
// //                 minValue: 1,
// //                 startAtMax: "",
// //                 endAtMax: "",
// //                 startAtMin: "",
// //                 endAtMin: ""
// //             };
// //             let happyStatus = {
// //                 maxValue: 0,
// //                 minValue: 1,
// //                 startAtMax: "",
// //                 endAtMax: "",
// //                 startAtMin: "",
// //                 endAtMin: ""
// //             };
// //             let sadStatus = {
// //                 maxValue: 0,
// //                 minValue: 1,
// //                 startAtMax: "",
// //                 endAtMax: "",
// //                 startAtMin: "",
// //                 endAtMin: ""
// //             };
// //             let angryStatus = {
// //                 maxValue: 0,
// //                 minValue: 1,
// //                 startAtMax: "",
// //                 endAtMax: "",
// //                 startAtMin: "",
// //                 endAtMin: ""
// //             };
// //             let fearfulStatus = {
// //                 maxValue: 0,
// //                 minValue: 1,
// //                 startAtMax: "",
// //                 endAtMax: "",
// //                 startAtMin: "",
// //                 endAtMin: ""
// //             };
// //             let disgustedStatus = {
// //                 maxValue: 0,
// //                 minValue: 1,
// //                 startAtMax: "",
// //                 endAtMax: "",
// //                 startAtMin: "",
// //                 endAtMin: ""
// //             };
// //             let surprisedStatus = {
// //                 maxValue: 0,
// //                 minValue: 1,
// //                 startAtMax: "",
// //                 endAtMax: "",
// //                 startAtMin: "",
// //                 endAtMin: ""
// //             };
// //             while ((startDateInt < endDateInt) && (assertCounter < MAX_ITERATIONS)) {
// //                 assertCounter++;
// //                 startDateIntNext = new Date((startDateInt + (15 * 60 * 1000)));
// //                 arrayOfEmotions = await findEmotions({ "createdAt": { "$gte": startDate, "$lt": startDateIntNext } });
// //                 for (let i = 0; i < arrayOfEmotions.length; i++) {
// //                     if (arrayOfEmotions[i]["neutral"] > neutralStatus.maxValue) {
// //                         neutralStatus.maxValue = arrayOfEmotions[i]["neutral"];
// //                         neutralStatus.startAtMax = startDate.getTime().toString();
// //                         neutralStatus.endAtMax = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["neutral"] < neutralStatus.minValue) {
// //                         neutralStatus.minValue = arrayOfEmotions[i]["neutral"];
// //                         neutralStatus.startAtMin = startDate.getTime().toString();
// //                         neutralStatus.endAtMin = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["happy"] > happyStatus.maxValue) {
// //                         happyStatus.maxValue = arrayOfEmotions[i]["happy"];
// //                         happyStatus.startAtMax = startDate.getTime().toString();
// //                         happyStatus.endAtMax = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["happy"] < happyStatus.minValue) {
// //                         happyStatus.minValue = arrayOfEmotions[i]["happy"];
// //                         happyStatus.startAtMin = startDate.getTime().toString();
// //                         happyStatus.endAtMin = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["sad"] > sadStatus.maxValue) {
// //                         sadStatus.maxValue = arrayOfEmotions[i]["sad"];
// //                         sadStatus.startAtMax = startDate.getTime().toString();
// //                         sadStatus.endAtMax = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["sad"] < sadStatus.minValue) {
// //                         sadStatus.minValue = arrayOfEmotions[i]["sad"];
// //                         sadStatus.startAtMin = startDate.getTime().toString();
// //                         sadStatus.endAtMin = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["angry"] > angryStatus.maxValue) {
// //                         angryStatus.maxValue = arrayOfEmotions[i]["angry"];
// //                         angryStatus.startAtMax = startDate.getTime().toString();
// //                         angryStatus.endAtMax = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["angry"] < angryStatus.minValue) {
// //                         angryStatus.minValue = arrayOfEmotions[i]["angry"];
// //                         angryStatus.startAtMin = startDate.getTime().toString();
// //                         angryStatus.endAtMin = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["fearful"] > fearfulStatus.maxValue) {
// //                         fearfulStatus.maxValue = arrayOfEmotions[i]["fearful"];
// //                         fearfulStatus.startAtMax = startDate.getTime().toString();
// //                         fearfulStatus.endAtMax = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["fearful"] < fearfulStatus.minValue) {
// //                         fearfulStatus.minValue = arrayOfEmotions[i]["fearful"];
// //                         fearfulStatus.startAtMin = startDate.getTime().toString();
// //                         fearfulStatus.endAtMin = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["disgusted"] > disgustedStatus.maxValue) {
// //                         disgustedStatus.maxValue = arrayOfEmotions[i]["disgusted"];
// //                         disgustedStatus.startAtMax = startDate.getTime().toString();
// //                         disgustedStatus.endAtMax = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["disgusted"] < disgustedStatus.minValue) {
// //                         disgustedStatus.minValue = arrayOfEmotions[i]["disgusted"];
// //                         disgustedStatus.startAtMin = startDate.getTime().toString();
// //                         disgustedStatus.endAtMin = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["surprised"] > surprisedStatus.maxValue) {
// //                         surprisedStatus.maxValue = arrayOfEmotions[i]["surprised"];
// //                         surprisedStatus.startAtMax = startDate.getTime().toString();
// //                         surprisedStatus.endAtMax = startDateIntNext.getTime().toString();
// //                     }
// //                     if (arrayOfEmotions[i]["surprised"] < surprisedStatus.minValue) {
// //                         surprisedStatus.minValue = arrayOfEmotions[i]["surprised"];
// //                         surprisedStatus.startAtMin = startDate.getTime().toString();
// //                         surprisedStatus.endAtMin = startDateIntNext.getTime().toString();
// //                     }
// //                 }
// //                 emotionsTotal.push(arrayOfEmotions);
// //                 startDateInt = startDateIntNext;
// //             }
// //             let finalResult = [];
// //             let neutralSum = 0;
// //             let happySum = 0;
// //             let sadSum = 0;
// //             let angrySum = 0;
// //             let fearfulSum = 0;
// //             let disgustedSum = 0;
// //             let surprisedSum = 0;
// //             for (let i = 0; i < emotionsTotal.length; i++) {
// //                 for (let j = 0; j < emotionsTotal[i]; j++) {
// //                     neutralSum = neutralSum += emotionsTotal[i][j]["neutral"];
// //                     happySum = happySum += emotionsTotal[i][j]["happy"];
// //                     sadSum = sadSum += emotionsTotal[i][j]["sad"];
// //                     angrySum = angrySum += emotionsTotal[i][j]["angry"];
// //                     fearfulSum = fearfulSum += emotionsTotal[i][j]["fearful"];
// //                     disgustedSum = disgustedSum += emotionsTotal[i][j]["disgusted"];
// //                     surprisedSum = surprisedSum += emotionsTotal[i][j]["surprised"];
// //                 }
// //                 finalResult.push([(neutralSum / emotionsTotal[i]), (happySum / emotionsTotal[i]), (sadSum / emotionsTotal[i]), (angrySum / emotionsTotal[i]), (fearfulSum / emotionsTotal[i]), (disgustedSum / emotionsTotal[i]), (surprisedSum / emotionsTotal[i])])
// //             }
// //             // [[Float]]
// //             // {
// //             //     averages: [[Float]],
// //             //     status: [Status]
// //             // }
// //             return {
// //                 averages: finalResult,
// //                 status: [neutralStatus, happyStatus, sadStatus, angryStatus, fearfulStatus, disgustedStatus, surprisedStatus]
// //         }
// //         }
// //     },
// //     Mutation: {
// //         addUser(_, { firstName, lastName, password, age, gender }) {
// //             return insertUser({ firstName, lastName, password, age, gender })
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         async removeUser(_, { userId }) {
// //             return await deleteUser(userId)
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     return err;
// //                 })
// //         },
// //         updateUser(_, { userId, obj }) {
// //             return updateOneUser(userId, obj)
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         addAdmin(_, { firstName, lastName, email, password }) {
// //             return createAdmin({ firstName, lastName, email, password })
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         removeAdmin(_, { _id }) {
// //             return findOneByIdAndRemove(_id)
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err
// //                 })
// //         },
// //         updateAdmin(_, { _id, obj }) {
// //             return findOneByIdAndUpdate(_id, obj)
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         // Emotion Part --> to be refactored later on
// //         addEmotion(_, { neutral, angry, disgust, happy, fear, sad, surprised, userId }) {
// //             return insertOneEmotion({ neutral, angry, disgust, happy, fear, sad, surprised, userId })
// //                 .then(result => {
// //                     return result
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         removeEmotion(_, { _id }) {
// //             return removeEmotionById(_id)
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         updateEmotion(_, { _id, obj }) {
// //             return updateEmotionById(_id, obj)
// //                 .then(result => {
// //                     // TOOD: may be done later on
// //                 })
// //                 .catch(err => {
// //                     return err;
// //                 })
// //         },
// //         async uploadUser(parent, { data }) {
// //             const { filename, createReadStream } = await data.photo;
// //             try {
// //                 const result = await new Promise((resolve, reject) => {
// //                     createReadStream().pipe(
// //                         cloudinary.uploader.upload_stream((error, result) => {
// //                             if (error) {
// //                                 reject(error)
// //                             }
// //                             resolve(result)
// //                         })
// //                     )
// //                 });
// //                 // const newPhoto = { filename, path: result.secure_url };
// //                 // photos.push(newPhoto);
// //                 let user = await insertUser({
// //                     firstName: data.firstName,
// //                     lastName: data.lastName,
// //                     age: data.age,
// //                     gender: data.gender,
// //                     photoUrl: result.secure_url
// //                 });
// //                 if (!user) {
// //                     return new Error("Error with inserting the user")
// //                 }
// //                 //the code for inserting the Descriptor should follow here
// //                 insertOneDescriptor({
// //                     userId: user._id,
// //                     front: data.descriptors[0],
// //                     left:data.descriptors[1],
// //                     right:data.descriptors[2]
// //                 });
// //                 console.log("Inserted Successful");
// //                 return user;
// //             } catch (err) {
// //                 console.error(err);
// //                 return err;
// //             }
// //         },
// //         async addClusters(_, arrayOfObjects) {
// //             return insertManyClusters(arrayOfObjects)
// //                 .then(result => {
// //                     return result
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         async removeCluster(_, { _id }) {
// //             return removeClusterById(_id)
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         },
// //         async removeDescriptor(_, { _id }) {
// //             return removeDescriptorById(_id)
// //                 .then(result => {
// //                     return result;
// //                 })
// //                 .catch(err => {
// //                     throw err;
// //                 })
// //         }
// //     }
// // };