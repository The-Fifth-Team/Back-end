const { gql } = require('apollo-server-express');

module.exports = typeDefs = gql`
  type Photo {
    filename: String!
    path: String!
  }

  type Query {
    users: [User!]!
    admins: [Admin!]!
    emotions: [Emotion!]!
    filterEmotions(date: String!): [Emotion!]!
    allPhotos: [Photo]
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, password: String, age: Int!, gender: String!): User!
    removeUser(userId: String!): User!
    updateUser(userId: String!, obj: userObj): User

    addAdmin(firstName: String!, lastName: String!, password: String!, email: String!): Admin!
    removeAdmin(_id: String!): Admin!
    updateAdmin(_id: String!, obj: adminObj): Admin

    addEmotion(neutral: Int, angry: Int, disgust: Int, happy: Int, fear: Int, sad: Int, surprised: Int, userId: String): Emotion
    removeEmotion(_id: String!): Emotion!
    updateEmotion(_id: String!, obj: emotionObj): Emotion

    uploadPhoto(photo: Upload!): Photo!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    password: String!
    age: Int!
    gender: String!
  }

  type Admin {
    id: ID!
    firstName: String!
    lastName: String!
    password: String!
    email: String!
  }

  type Emotion {
    id: ID!
    neutral: Int
    angry: Int
    disgust: Int
    happy: Int
    fear: Int
    sad: Int
    surprised: Int
    userId: String
    createdAt: String
  }
  
  input userObj {
    firstName: String
    lastName: String
    password: String
    age: Int
    gender: String
  }
  
  input adminObj {
    firstName: String
    lastName: String
    password: String
    email: String
  }
  
  input emotionObj {
    neutral: Int
    angry: Int
    disgust: Int
    happy: Int
    fear: Int
    sad: Int
    surprised: Int
    userId: String
  }
`;