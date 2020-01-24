const { insertUser, deleteUser, getUsers, update, User } = require('../../Models/User');

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
      removeUser: async ( userId ) => {
        return await deleteUser(userId)
          .then(result => {
            // TODO: show something when user is deleted!
            // return `${userId} has been deleted!`
          })
      },
      updateUser: (root, params) => {
        console.log(root, params)
        return User.findByIdAndUpdate(        )
        
      },
    }
  };