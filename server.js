const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const PORT = process.env.PORT || 4000;

var cors = require('cors');
app.use(cors());

const { createServer } = require('http');
const { PubSub } = require('apollo-server');

const pubsub = new PubSub();


const app = express();
app.use(express.json());

dotenv.config({ path: './config.env' });
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req, res, pubsub}) => {
    return { token : req.headers["authorization"], pubsub};
  },
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      // Client connection
    },
    onDisconnect: (webSocket, context) => {
      // Client disconnects
    }
  },
  introspection: true,
});

server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

mongoose.Promise = global.Promise;
// Mongodb connection//
mongoose.connect("mongodb+srv://ali-jalal:thefifthteam@cluster0-p3vu6.mongodb.net/test?retryWrites=true&w=majority", {
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

httpServer.listen({ port: PORT }, () => {
    console.log(`Server ready at http://localhost:4000/graphql`);
});