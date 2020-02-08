const { gql } = require('apollo-server-express');

module.exports = typeDefs = gql `
  type Query {
    users: [User!]!
    allPhotos: [Photo]
    admins: [Admin!]!
    emotions: [Emotion!]!
    filterEmotions(date: String!): [Emotion!]!
    getPeriodEmotions(startDate: String!, endDate: String!): [[[Float!]!]!,[Status!]]!
  type Token {
    token: String!
  }
  type Photo {
    filename: String!
    path: String!
  }
  type Mutation {
    addUser(firstName: String!, lastName: String!, password: String!, age: Int!, gender: String!): User!
    addUser(firstName: String!, lastName: String!, password: String!, age: Int!, gender: String!): User!
    removeUser(userId: String!): User!
    updateUser(userId: String!, obj: userObj): User

    addAdmin(firstName: String!, lastName: String!, password: String!, email: String!): Admin!
    removeAdmin(_id: String!): Admin!
    updateAdmin(_id: String!, obj: adminObj): Admin

    addEmotion(neutral: Int, angry: Int, disgust: Int, happy: Int, fear: Int, sad: Int, surprised: Int, userId: String): Emotion
    removeEmotion(_id: String!): Emotion!
    updateEmotion(_id: String!, obj: emotionObj): Emotion

    forgetPassword(email: String!): Token
    checkToken(token: String): Token!
    resetPassword(token: String!, email: String!): Token!
    uploadUser(data: User!): Photo 
  }

  type User {
    firstName: String!
    lastName: String!
    age: Int!
    gender: String!
    descriptors: [[Float]]!
    photo: Upload!
  }
  type Admin {
    id: ID!
    firstName: String!
    lastName: String!
    password: String!
    email: String!
  }
  type Emotion {
    neutral: Float
    happy: Float
    sad: Float
    angry: Float
    fearful: Float
    disgusted: Float
    surprised: Float
    userId: ID
    createdAt: String
  }
  type Cluster {
    id: ID!
    array: [String!]!
    createdAt: String
  }
  type Descriptor {
    id: ID!
    front: [Float!]!
    left: [Float!]!
    right: [Float!]!
    userId: String!
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
  input User {
    firstName: String!
    lastName: String!
    age: Int!
    gender: String!
    descriptors: [[Float]]!
    photo: Upload!
  }
`;