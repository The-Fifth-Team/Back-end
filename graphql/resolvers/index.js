const { insertUser, getUsers } = require('../../Models/User');

module.exports =  resolvers = {
    Query: {
      users: () => {
        return getUsers()
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      }
    },
    Mutation: {
      addUser: (_, { firstName, lastName, password, age, gender } ) => {
        return insertUser( { firstName, lastName, password, age, gender } )
          .then(result => {
            return result;
          })
          .catch(err => {
            console.log(err);
          })
      }
    }
  };