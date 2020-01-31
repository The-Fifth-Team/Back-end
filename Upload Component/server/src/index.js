const { ApolloServer } = require('apollo-server')
const { existsSync, mkdirSync } = require("fs");
const path = require("path");
require('dotenv').config()
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
existsSync(path.join(__dirname, "../images")) || mkdirSync(path.join(__dirname, "../images"));
const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => console.log(`Server ready at ${url}`));