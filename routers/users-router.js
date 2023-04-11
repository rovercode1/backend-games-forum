const userRouter = require('express').Router();
const {getUsers} = require('../controllers/user-controllers')

userRouter.get("/", getUsers);

module.exports = userRouter;