const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { deleteUser } = require('./Models/User');
const { existsSync, mkdirSync } = require("fs");
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
dotenv.config({ path: '../config.env' });
const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.applyMiddleware({ app });

mongoose.Promise = global.Promise;
// Mongodb connection//
mongoose.connect('mongodb+srv://ali-jalal:thefifthteam@cluster0-p3vu6.mongodb.net/test?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
}, (err) => {
    if (err) {
        console.log('Error while connecting ..' + err)
    } else {
        console.log('Connected to Database');
    }
});
<<<<<<< HEAD:server.js

=======
>>>>>>> 8f28e7dfd8c2bdef4d22407a07a53b192a4c9604:server/server.js

app.listen({ port: PORT }, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});

