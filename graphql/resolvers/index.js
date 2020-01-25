const { insertUser, deleteUser, getUsers, updateOneUser, User } = require('../../Models/User');

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
      },
      removeUser: async (_, { userId } ) => {
        return await deleteUser(userId)
          .then(result => {
            return result
          })
          .catch(err => {
            return err
          })
      },
      updateUser: (_, {userId, obj}) => {
        return updateOneUser(userId, obj)
          .then(result => {
            return result;
          })
          .catch(err => {
            throw err;
          })
      },
    }
  };