const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const User = require('../../Models/User.js');
const Admin = require('../../Models/Admin.js');
const Emotion = require('../../Models/Emotion.js');
const Descriptor = require('../../Models/Descriptors.js');
const bcrypt = require('bcryptjs')
const recognizerService = require('../../services/recognizer/recognizer.js');
const faceRecognizer = require('../../services/recognizer/faceRecognizer.js');
const json2csv = require('../../helper_function/json2csv');

//This is the Configuration for the the Cloudniray services
//to be able to save images online

require('../../SERVER_CACHE_MEMORY');

const emotions = [];
const EMOTION_CHANNEL = 'EMOTION_CHANNEL';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.PHOTO_CLOUD_API_KEY,
    api_secret: process.env.PHOTO_CLOUD_API_SECRET
});

/**
 * @function _signToken - used to sign a jwt token, based on a specific string
 * @param {string} id - the id of the user, to create the hash, based on it
 * @return {string} - hashed token to be returned
 * @private
 */
const _signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME });
/**
 * @function _verifyToken - used to verify the jwt token and return payload of everything match's
 * @param token - the token to be verified
 * @return {object} - object payload that corresponds to the token sent
 * @private
 */
const _verifyToken = token => jwt.verify(token, process.env.JWT_SECRET);

//Resolvers for the system which contain the Mutations and Queries for the graphql API
const resolvers = {
    Subscription: {
        faceDetected: {
            subscribe: (_, { data }, { pubsub }) => pubsub.asyncIterator(EMOTION_CHANNEL, data)
        }
    },
    Mutation: {
        /**
         * @async
         * @function uploadUser used to save a user to the database of the system with his/her photo and face descriptors
         * @param {object} parent pointer which points to the parent function which called this function (IF EXISTS)
         * @param {object} data  the object that contains the data needed for this mutation
         * @return {Promise<object|Error>} user  the User that get saved to the database, return Error if problem occurred
         * @since 1.0.0
         */
        async uploadUser(parent, { data }, ) {
            const { createReadStream } = await data.photo;
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
            User.insertUser({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    age: data.age,
                    gender: data.gender,
                    photoUrl: result.secure_url
                })
                .then(userData => {
                    return Descriptor.insertOneDescriptor({
                        userId: userData._id,
                        front: data.descriptors[0],
                        left: data.descriptors[1],
                        right: data.descriptors[2]
                    });
                })
                .then(result => {
                    console.log("User Inserted");
                    console.log("Descriptor Inserted ");
                    console.log(result);
                })
                .catch(err => {
                    console.error(err);
                })
                // deletes the key for descriptors, because the cache now does not contain the most updated version of the descriptors
            SERVER_CACHE_MEMORY[process.env.DESCRIPTOR_KEY] = undefined;
            //this should be added to any function that well manipulate the descriptors, collations EXCEPT for querying and reading functions
        },
        /**
         * @function addAdmin used to add an admin to the database
         * @param {object} parent pointer which points to the parent function which called this function (IF EXISTS)
         * @param {object} data  the object that contains the data needed for this mutation, admin object
         * @return {Promise<object|Error>} the admin that get saved to the database, return Error if problem occurred
         * @since 1.0.0
         */
        addAdmin(parent, { data }) {
            return Admin.createAdmin(data);
        },
        /**
         * @async
         * @function userFaceIdentifier checks the emotions sent from the front-end,and identify for who they belong
         * @param {object} parent pointer which points to the parent function which called this function (IF EXISTS)
         * @param {object} data the object that contains the data needed for this mutation
         * @since 1.0.0
         * @version 1.0.0
         */
        userFaceIdentifier(parent, { data }, { pubsub }) {
            const toBeSaved = recognizerService(data);
            Emotion.insertManyEmotion(toBeSaved)
                .then(emotionData => {
                    emotions.push(emotionData);
                    pubsub.publish(EMOTION_CHANNEL, {
                        faceDetected: emotionData
                    })
                })
                .catch(err => {
                    console.error(err);
                })
        },

        /**
         * @async
         * @function signInAdmin - used to verify an admin sign_in and return token of valid
         * @param {object} parent - pointer which points to the parent function which called this function (IF EXISTS)
         * @param email - email of the admin
         * @param password - password of the admin
         * @return {Promise<{token: string}|Error>} - jwt token, built based on the admin object id
         */
        async signInAdmin(parent, { email, password }) {
            try {
                const admin = await Admin.findOneAdmin({ email });
                const isValid = await bcrypt.compare(password, admin.password);
                if (isValid) {
                    return { token: _signToken(admin._id) };
                } else {
                    return new AuthenticationError("EMAIL OR PASSWORD DOES NOT MATCH");
                }
            } catch (e) {
                return e;
            }

        }
    },
    Query: {
        emotions() {
            return emotions
        },
        /**
         * @function getAllUsers used to pull all the users from the database
         * @return {Promise<object|Error>} all the users that exists in the database, return Error if problem occurred
         * @since 1.0.0
         */
        getAllUsers() {
            return User.findUsers();
        }
        /**
         * @function getAllAdmins pulls all the admin from the database
         * @return {Promise<object|Error>} all the admins that exists in the database, return Error if problem occurred
         * @since 1.0.0
         * @deprecated
         */
        // getAllAdmins() {
        //     return Admin.findAdmins();
        // }
        ,
        /**
         * @async
         * @function getPeriodEmotions This function is used to get all the emotions during a given period, e.g.. from 31/1/2020 --- 2/2/2020,
         * and also return the Noise in that Period,i.e.. the Anomaly emotions, or in other words the abnormality in the result, during that period
         * it returns an array of emotions separated by a TIME GAP between each array, e.g.. 15min gaps meaning it well return multiple arrays of emotions that occurs in 8:00 through 8:15
         * and then other array in the period 8:15 -> 8:30 and so on, so that a 15min time gap, then, calculate all their averages and return them along with the noise
         * @param {object} parent - pointer which points to the parent function which called this function (IF EXISTS)
         * @param {string} startDate - the start date in stringified format
         * @param {string} endDate - the end date in stringified format
         * @param token - the admin token sent from the front-end
         * @return {Promise<object|Error>} object contains the array of arrays of the averages, and the Noise Emotions
         * @since 1.0.0
         * @version 1.3.1
         */
        async getPeriodEmotions(parent, { startDate, endDate }, { token }) {
            // let admin = await Admin.findByIdAdmin( _verifyToken(token)._id );
            // if(!admin){
            //     return new Error("Authorized Personnel Only!")
            // }
            let startDateInt = parseInt(startDate); // INT type
            let endDateInt = parseInt(endDate); // INT type
            let timeStamps = [];
            startDate = new Date(startDateInt); // Date type
            endDate = new Date(endDateInt); // Date type

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
            let startDateIntNext, startPeriod, endPeriod;
            while ((startDateInt < endDateInt) && (assertCounter < MAX_ITERATIONS)) {
                assertCounter++;
                startDateIntNext = (startDateInt + (15 * 60 * 1000));
                startPeriod = new Date(startDateInt);
                endPeriod = new Date(startDateIntNext);

                arrayOfEmotions = await Emotion.findEmotions({
                    "createdAt": {
                        "$gte": startPeriod,
                        "$lt": endPeriod
                    }
                });

                for (let i = 0; i < arrayOfEmotions.length; i++) {
                    if (arrayOfEmotions[i]["neutral"] > neutralStatus.maxValue) {
                        neutralStatus.maxValue = arrayOfEmotions[i]["neutral"];
                        neutralStatus.startAtMax = startDateInt.toString();
                        neutralStatus.endAtMax = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["neutral"] < neutralStatus.minValue) {
                        neutralStatus.minValue = arrayOfEmotions[i]["neutral"];
                        neutralStatus.startAtMin = startDateInt.toString();
                        neutralStatus.endAtMin = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["happy"] > happyStatus.maxValue) {
                        happyStatus.maxValue = arrayOfEmotions[i]["happy"];
                        happyStatus.startAtMax = startDateInt.toString();
                        happyStatus.endAtMax = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["happy"] < happyStatus.minValue) {
                        happyStatus.minValue = arrayOfEmotions[i]["happy"];
                        happyStatus.startAtMin = startDateInt.toString();
                        happyStatus.endAtMin = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["sad"] > sadStatus.maxValue) {
                        sadStatus.maxValue = arrayOfEmotions[i]["sad"];
                        sadStatus.startAtMax = startDateInt.toString();
                        sadStatus.endAtMax = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["sad"] < sadStatus.minValue) {
                        sadStatus.minValue = arrayOfEmotions[i]["sad"];
                        sadStatus.startAtMin = startDateInt.toString();
                        sadStatus.endAtMin = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["angry"] > angryStatus.maxValue) {
                        angryStatus.maxValue = arrayOfEmotions[i]["angry"];
                        angryStatus.startAtMax = startDateInt.toString();
                        angryStatus.endAtMax = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["angry"] < angryStatus.minValue) {
                        angryStatus.minValue = arrayOfEmotions[i]["angry"];
                        angryStatus.startAtMin = startDateInt.toString();
                        angryStatus.endAtMin = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["fearful"] > fearfulStatus.maxValue) {
                        fearfulStatus.maxValue = arrayOfEmotions[i]["fearful"];
                        fearfulStatus.startAtMax = startDateInt.toString();
                        fearfulStatus.endAtMax = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["fearful"] < fearfulStatus.minValue) {
                        fearfulStatus.minValue = arrayOfEmotions[i]["fearful"];
                        fearfulStatus.startAtMin = startDateInt.toString();
                        fearfulStatus.endAtMin = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["disgusted"] > disgustedStatus.maxValue) {
                        disgustedStatus.maxValue = arrayOfEmotions[i]["disgusted"];
                        disgustedStatus.startAtMax = startDateInt.toString();
                        disgustedStatus.endAtMax = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["disgusted"] < disgustedStatus.minValue) {
                        disgustedStatus.minValue = arrayOfEmotions[i]["disgusted"];
                        disgustedStatus.startAtMin = startDateInt.toString();
                        disgustedStatus.endAtMin = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["surprised"] > surprisedStatus.maxValue) {
                        surprisedStatus.maxValue = arrayOfEmotions[i]["surprised"];
                        surprisedStatus.startAtMax = startDateInt.toString();
                        surprisedStatus.endAtMax = startDateIntNext.toString();
                    }
                    if (arrayOfEmotions[i]["surprised"] < surprisedStatus.minValue) {
                        surprisedStatus.minValue = arrayOfEmotions[i]["surprised"];
                        surprisedStatus.startAtMin = startDateInt.toString();
                        surprisedStatus.endAtMin = startDateIntNext.toString();
                    }
                }
                if (arrayOfEmotions.length !== 0) {
                    emotionsTotal.push(arrayOfEmotions);
                    timeStamps.push(startDateIntNext.toString());
                }
                startDateInt = startDateIntNext;
            }
            let finalResult = [];
            let neutralSum, happySum, sadSum, angrySum, fearfulSum, disgustedSum, surprisedSum;
            neutralSum = happySum = sadSum = angrySum = fearfulSum = disgustedSum = surprisedSum = 0;
            for (let i = 0; i < emotionsTotal.length; i++) {
                for (let j = 0; j < emotionsTotal[i].length; j++) {
                    neutralSum += emotionsTotal[i][j]["neutral"];
                    happySum += emotionsTotal[i][j]["happy"];
                    sadSum += emotionsTotal[i][j]["sad"];
                    angrySum += emotionsTotal[i][j]["angry"];
                    fearfulSum += emotionsTotal[i][j]["fearful"];
                    disgustedSum += emotionsTotal[i][j]["disgusted"];
                    surprisedSum += emotionsTotal[i][j]["surprised"];
                }
                finalResult.push([(neutralSum / emotionsTotal[i].length), (happySum / emotionsTotal[i].length), (sadSum / emotionsTotal[i].length), (angrySum / emotionsTotal[i].length), (fearfulSum / emotionsTotal[i].length), (disgustedSum / emotionsTotal[i].length), (surprisedSum / emotionsTotal[i].length)])
            }
            return {
                averages: finalResult,
                status: [neutralStatus, happyStatus, sadStatus, angryStatus, fearfulStatus, disgustedStatus, surprisedStatus],
                timeStamps
            }
        },
        /**
         * @async
         * @function faceLogIn this function is used to check the face descriptors for a specific user,of it match ,token well be sent to the front end
         * @param {object} parent - pointer which points to the parent function which called this function (IF EXISTS)
         * @param {Array} data - the array of face descriptors for the user
         * @return {object} the - jwt sign-in-token to be saved in the frontend
         * @version 1.0.0
         * @since 1.0.0
         */
        async faceLogIn(parent, { data }) {
            try {
                let str = await faceRecognizer(data);
                if (!str) {
                    return new AuthenticationError("UNKNOWN USER");
                }
                str = str.split(" ")[0].toString();
                const user = await User.findByIdUser(str);
                return { token: _signToken(user._id) };
            } catch (e) {
                return e;
            }
        },
        /**
         * @async
         * @function getEmotionAveragesForLast24Hours - return the averages of all the emotions that happened in the last 24 hours
         * @return {object} - the object that contains the averages in the last hours
         */
        async getEmotionAveragesForLast24Hours() {
            let result = await Emotion.aggregate([{ $match: { createdAt: { $gte: new Date(Date.now() - (24 * 60 * 60 * 1000)) } } }, {
                $group: {
                    _id: "",
                    neutral: { $avg: "$neutral" },
                    happy: { $avg: "$happy" },
                    sad: { $avg: "$sad" },
                    angry: { $avg: "$angry" },
                    fearful: { $avg: "$fearful" },
                    disgusted: { $avg: "$disgusted" },
                    surprised: { $avg: "$surprised" }
                }
            }]);
            delete result[0]["_id"];
            return result[0];
        },
        /**
         * @async
         * @function getEmotionsCsvReport - used to return all the emotions in the database as a CSV report String
         * @return {Promise<string>} - string contains a CSV report
         */
        async getEmotionsCsvReport() {
            let emotions = await Emotion.findEmotions({}).populate("userId");
            console.log(emotions);
            // Because of the others Hidden Attributes // Can Be seen by console.dir(nameOFYouVariable)
            // i need to extract the attributes i need to run a loop
            let result = [];
            for (let i = 0; i < emotions.length; i++) {
                result.push({
                    userId: emotions[i].userId._id,
                    firstName: emotions[i].userId.firstName,
                    lastName: emotions[i].userId.lastName,
                    gender: emotions[i].userId.gender,
                    neutral: emotions[i].neutral,
                    happy: emotions[i].happy,
                    sad: emotions[i].sad,
                    angry: emotions[i].angry,
                    fearful: emotions[i].fearful,
                    disgusted: emotions[i].disgusted,
                    surprised: emotions[i].surprised
                })
            }
            return json2csv.json2CsvASync(result);
        }
    }
};
module.exports = resolvers;