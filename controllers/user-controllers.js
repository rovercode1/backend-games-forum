const {selectUsers, selectUserById} = require('../models/user-models')

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      response.status(200).send({ users: users });

    })
    .catch((err) => {
      next(err);
    });

};

exports.getUserById = (request, response, next) => {
  const username = request.params.username;
  selectUserById(username)
    .then((user) => {
    response.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });

};


