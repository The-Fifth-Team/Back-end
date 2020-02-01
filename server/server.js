const express = require('express');
const mongoose = require('mongoose');

const app = express();

const { ApolloServer } = require('apollo-server-express');
const { existsSync, mkdirSync } = require("fs");
const path = require('path');
// require('dotenv').config();
const typeDefs = require('../graphql/schema/index')
const resolvers = require('../graphql/resolvers/index')

existsSync(path.join(__dirname, "../images")) || mkdirSync(path.join(__dirname, "../images"));

app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers
});

// server will be applied as middleware for all requests
server.applyMiddleware({ app }); 


// Mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/the-fifth', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
}, (err) => { 
  if (err) {
    console.log('Error while connecting ..' + err)
  } else {
    console.log('Connected to Database')
  }
});
// Mongodb connection

app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
});
