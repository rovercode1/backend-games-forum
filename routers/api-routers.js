const apiRouter = require('express').Router();
const categoryRouter = require('./category-router')
const userRouter = require('./users-router')
const reviewRouter = require('./review-router')
const commentRouter = require('./comment-router')
const fs = require('fs');

apiRouter.get('/', (req, res) => {
  fs.readFile('endpoints.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading endpoints file');
    } else {
      const endpoints =  JSON.parse(data);
      res.send({endpoints});
    }
  });
});

apiRouter.use('/categories', categoryRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/reviews', reviewRouter);
apiRouter.use('/comments', commentRouter);

module.exports = apiRouter;