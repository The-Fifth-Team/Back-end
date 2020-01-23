const assert = require('assert');
const Emotions = require('../Models/Emotions.js');

describe("Emotions CRUD operations", () => {
    it("insertMany" , done => {
        const testArrayOfObject = [{neutral:0, angry:1, disgust:0, happy:0, fear:0, sad:0, surprised:0, userId:null},
            {neutral:1, angry:0, disgust:0, happy:0, fear:0, sad:0, surprised:0, userId:null},
            {neutral:0, angry:0, disgust:0, happy:0, fear:0, sad:1, surprised:0, userId:null}];
        Emotions.insertMany(testArrayOfObject).then(data => {
                assert(!!data);
                done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });

    it("insertOne" , done => {
        const testObject = {neutral:0, angry:1, disgust:0, happy:0, fear:0, sad:0, surprised:0, userId:null};
        Emotions.insertOne(testObject).then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });
});
describe("", () => {

    beforeEach((done) => {
        const testObject = {neutral:1, angry:0, disgust:0, happy:0, fear:0, sad:0, surprised:0, userId:null};
        Emotions.insertOne(testObject).then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });

    it("removeEmotionById", done => {
        Emotions.findOneEmotion({neutral:1}).then(data => {
            return Emotions.removeEmotionById(data._id.toString());
        }).then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });

    //needs userId Atterbute to continue with the test
    xit("removeEmotionsByUserId", done => {
        Emotions.removeEmotionsByUserId({userId:"null"}).then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });

    it("updateEmotionById", done => {
        const testObject = {neutral:1, angry:0, disgust:0, happy:0, fear:0, sad:0, surprised:0, userId:null};
        Emotions.findOneEmotion({neutral:1}).then(data => {
            return Emotions.updateEmotionById(data._id.toString(),testObject);
        }).then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });

    it("findOneEmotion", done => {
        Emotions.findOneEmotion({neutral:1}).then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });

    it("findByIdEmotion", done => {
        Emotions.findOneEmotion({neutral:1}).then(data => {
            return Emotions.findByIdEmotion(data._id.toString());
        }).then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });


    it("findAllEmotions", done => {
        Emotions.findAllEmotions().then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    })

    xit("findByUserIdEmotion", done => {
        Emotions.findByUserIdEmotion({userId:"null"}).then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });
});