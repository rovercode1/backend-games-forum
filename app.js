const apiRouter = require('./routers/api-routers');
const express = require("express");
const cors = require('cors');
const app = express();
const fs = require('fs');

const {
  handleServerErrors,
  handle404Errors,
  handle400Errors,
  handle500statuses,
} = require("./controllers/controllers");

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.use(handle404Errors);
app.use(handle400Errors);
app.use(handleServerErrors);
app.use(handle500statuses);

module.exports = app;
