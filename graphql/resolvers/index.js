const cloudinary = require('cloudinary').v2;
const User = require('../../Models/User.js');
const Admin = require('../../Models/Admin.js');
const Emotion = require('../../Models/Emotion.js');
const Descriptor = require('../../Models/Descriptors.js');
const recognizerService = require('../../services/recognizer/recognizer.js');
const faceRecognizer = require('../../services/recognizer/faceRecognizer.js');
//This is the Configuration for the the Cloudniray services
//to be able to save images online
cloudinary.config({
    cloud_name: "dwtaamxgn",
    api_key: "431917237583798",
    api_secret: "LC0J_kCL5lesk7PVP1KviAgHSKY"
});
const _signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME });


//Resolvers for the system which contain the Mutations and Queries for the graphql API
const resolvers = {
    Mutation: {
        /**
         * @async
         * @function uploadUser used to save a user to the database of the system with his/her photo and face descriptors
         * @param {object} parent pointer which points to the parent function which called this function (IF EXISTS)
         * @param {object} data  the object that contains the data needed for this mutation
         * @return {Promise<object|Error>} user  the User that get saved to the database, return Error if problem occurred
         * @author Abobker Elaghel
         * @since 1.0.0
         */
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
                return user;
            } catch (err) {
                console.error(err);
                return err;
            }
        },
        /**
         * @function addAdmin used to add an admin to the database
         * @param {object} parent pointer which points to the parent function which called this function (IF EXISTS)
         * @param {object} data  the object that contains the data needed for this mutation, admin object
         * @return {Promise<object|Error>} the admin that get saved to the database, return Error if problem occurred
         * @author Abobker Elaghel
         * @since 1.0.0
         */
        addAdmin(parent, { data }) {
            return Admin.createAdmin(data);
        },
        /**
         * @async
         * @function userFaceIdentifier
         * @param {object} parent pointer which points to the parent function which called this function (IF EXISTS)
         * @param {object} data the object that contains the data needed for this mutation
         * @return {Promise<object|Error>}
         * @since 1.0.0
         */
        async userFaceIdentifier(parent, {data}){
             const toBeSaved = await recognizerService(data);
             const result = await Emotion.insertManyEmotion(toBeSaved);
             if(!result){
                 return new Error("error with fetching the Emotions")
             }
             //may want to return the emotions later
        }
    },
    Query: {
        /**
         * @function getAllUsers used to pull all the users from the database
         * @return {Promise<object|Error>} all the users that exists in the database, return Error if problem occurred
         * @author Abobker Elaghel
         * @since 1.0.0
         */
        getAllUsers() {
            return User.findUsers();
        }
        /**
         * @function getAllAdmins pulls all the admin from the database
         * @return {Promise<object|Error>} all the admins that exists in the database, return Error if problem occurred
         * @author Abobker Elaghel
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
         * @param {object} parent pointer which points to the parent function which called this function (IF EXISTS)
         * @param {string} startDate the start date in stringified format
         * @param {string} endDate the end date in stringified format
         * @return {Promise<object|Error>} object contains the array of arrays of the averages, and the Noise Emotions
         * @author Abobker Elaghel
         * @since 1.0.0
         * @version 1.3.1
         * @copyright The Fith-Team, All Rights Reserved
         */
         async getPeriodEmotions(parent, {startDate, endDate}){
            let startDateInt = parseInt(startDate); // INT type
            let endDateInt = parseInt(endDate); // INT type
            startDate = new Date(startDateInt); // Date type
            endDate = new Date(endDateInt); // Date type

            let arrayOfEmotions;
            let emotionsTotal = [];
            let assertCounter = 0;
            const MAX_ITERATIONS = 10000;

            let neutralStatus, happyStatus, sadStatus, angryStatus, fearfulStatus, disgustedStatus, surprisedStatus;
            neutralStatus = happyStatus = sadStatus = angryStatus = fearfulStatus = disgustedStatus = surprisedStatus = {
                maxValue: 0,
                minValue: 1,
                startAtMax: "",
                endAtMax: "",
                startAtMin: "",
                endAtMin: ""
            };

            let startDateIntNext,startPeriod,endPeriod;
            while ((startDateInt < endDateInt) && (assertCounter < MAX_ITERATIONS)) {
                assertCounter++;
                // startDateInt START
                // startDateIntNext END

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
                emotionsTotal.push(arrayOfEmotions);
                startDateInt = startDateIntNext;
            }
            let finalResult = [];
            let neutralSum, happySum, sadSum, angrySum, fearfulSum, disgustedSum, surprisedSum;
            neutralSum = happySum = sadSum = angrySum = fearfulSum = disgustedSum = surprisedSum = 0;
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
        },
        /**
         * @async
         * @function faceLogIn
         * @param {object} parent
         * @param {object} data
         * @return {Promise<object|Error>}
         * @author Abobker Elaghel
         * @version 1.0.0
         * @since 1.0.0
         */
        async faceLogIn(parent,{data}){
                const _id = faceRecognizer(data);
                if(!_id){
                    console.error("SERVER-SIDE ERROR- User not identified, ERROR IN faceLogIn");
                   return new Error("User not identified, ERROR IN faceLogIn");
                }
                const user = await User.findByIdUser(_id);
                if(!user){
                    console.error("SERVER-SIDE ERROR- No User Exists with the id provided, ERROR IN faceLogIn");
                    return new Error("No User Exists with the id provided, ERROR IN faceLogIn")
                }
        }
    }
};
module.exports = resolvers;