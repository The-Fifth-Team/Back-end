const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
dotenv.config({ path: './config.env' });
const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.applyMiddleware({ app });

mongoose.Promise = global.Promise;
// Mongodb connection//
mongoose.connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log('Error while connecting ..' + err)
    } else {
        console.log('Connected to Database');
    }
});


app.listen({ port: PORT }, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});