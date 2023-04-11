const userRouter = require('express').Router();
const {getUsers, getUserById} = require('../controllers/user-controllers')

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserById);

module.exports = userRouter;