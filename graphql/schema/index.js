const { gql } = require('apollo-server');

const typeDefs = gql`

  type Token {
  token: String!
  }

  type Mutation {
    uploadUser(data: UserInput!): User
    addAdmin(data: AdminInput!): Admin!
    userFaceIdentifier(data: [ObservationInput]!): Emotion
    signInAdmin(email: String!, password: String!): Token
  }

  type Query{
    getAllUsers: [User]!
    getPeriodEmotions(startDate: String!, endDate: String!): RiverChartReturnType
    faceLogIn(data: [Float!]!): Token
    getEmotionAveragesForLast24Hours: Emotion!
    getEmotionsCsvReport: String!
  }


  input AdminInput {
    firstName: String!
    lastName: String!
    password: String!
    email: String!
  }

  type Admin {
    firstName: String
    lastName: String
    email: String 
    createdAt: String
  }

  type User {
    _id:ID
    firstName: String
    lastName: String
    age: Int
    gender: String
    photoUrl: String
    createdAt: String
  }

  input UserInput {
    firstName: String!
    lastName: String!
    age: Int!
    gender: String!
    descriptors: [[Float]]!
    photo: Upload!
  }
     
  input EmotionInput {
    neutral: Float!
    happy: Float!
    sad: Float!
    angry: Float!
    fearful: Float!
    disgusted: Float!
    surprised: Float!
  }

  type Emotion {
    _id: ID
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

  type Status {
    maxValue: Float
    minValue: Float
    startAtMax: String
    endAtMax: String
    startAtMin: String
    endAtMin: String
  }

  type RiverChartReturnType {
    averages: [[Float!]!]!
    status: [Status!]!
    timeStamps: [String]!
  }
    
  input ObservationInput {
    descriptor: [Float]!
    expressions: EmotionInput!
  }
  
`;
module.exports = typeDefs;
