const express = require('express');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');
const { ApolloServer, gql } = require('apollo-server-express');
const { buildSchema } = require('graphql')
const { User, getUsers } = require('../Models/userModel');

const app = express();

app.use(express.json())

// app.use('/grpahql', graphqlHttp({
//   schema: buildSchema(`
//     schema {
//       query:
//       mutation: 
//     }
//   `),
//   rootValue: {
    
//   }
// }), (req, res, next) => {

// })

// GraphQl Part
// GraphQL-controller
const typeDefs = gql`
  type Query {
    users: [User!]!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    password: String!
    age: Int!
    gender: String!
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, password: String!, age: Int!, gender: String!): User!
  }
`;

// server-side logic ... like controller
const resolvers = {
  Query: {
    users: () => {
      return getUsers()
    }
  },
  Mutation: {
    addUser: (_, { firstName, lastName, password, age, gender } ) => {
      const user = new User({
        firstName, 
        lastName, 
        password, 
        age, 
        gender
      });
      console.log(user)
      return user.save()
    }
  }
};

const server = new ApolloServer({
  // typeDefs should be GraphQL schema string language *required
  typeDefs,
  resolvers
})

server.applyMiddleware({ app }); 
// GraphQl Part

// Mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/the-fifth', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
}, (err) => { 
    if (err) {
        console.log('Error while connecting ..' + err)
    } else {
        console.log('Connected to Database')
    }
})
// Mongodb connection


app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
})