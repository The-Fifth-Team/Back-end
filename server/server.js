const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../graphql/schema/index')
const resolvers = require('../graphql/resolvers/index')
const { deleteUser } = require('../Models/User')
const app = express();

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

// deleteUser("5e2aca9db6a58a2088043025")
//   .then(res => {
//     console.log(res)
//   })