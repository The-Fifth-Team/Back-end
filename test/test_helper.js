const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect('mongodb://localhost/testDatabase', {useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false, useCreateIndex:true});
    mongoose.connection
        .once('open', () => {
            console.log("TEST_ENV Database Connected!");
            done();
        })
        .on('error', err => {
            console.warn("Warning", err);
        });
});

beforeEach(done => {
    mongoose.connection.collections.admins.drop(() => {
        mongoose.connection.collections.emotions.drop(()=>{
            done();
        })
    });
});