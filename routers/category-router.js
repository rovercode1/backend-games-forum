const categoryRouter = require('express').Router();
const {getCategories} = require('../controllers/category-controllers')

categoryRouter.get("/", getCategories);

module.exports = categoryRouter;