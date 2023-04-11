exports.handle404Errors = (req, res, next) => {
  res.status(404).send({ msg: "Path not found." });
};

exports.handle400Errors = (err, req, res, next) => {
  if (err.code === "22P02" || err === 'Bad request.' || err.code === '42703'){
    res.status(400).send({ msg: "Bad request." });
  }else{
    next(err)
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  if (err.code === '23503') {
    const table = err.detail.split(' ')[err.detail.split(' ').length -1]
    tableType = table.split('"')[1]
    if(tableType === 'reviews'){
      res.status(404).send({ msg: "Review not found." });
    }
    else if(tableType === 'users'){
      res.status(404).send({ msg: "User not found." });
    }
  }
  else if(err === 'Comment not found.'){
    res.status(404).send({ msg: "Comment not found." });
  }
  else if(err === 'User not found.'){
    res.status(404).send({ msg: "User not found." });
  }
  else if(err === 'Review not found.'){
    res.status(404).send({ msg: "Review not found." });
  }
  else {
    next(err);
  }
}

exports.handle500statuses = (err, req, res, next) => {
  console.log(err, "<-error");
  res.status(500).send({ msg: "Internal Server Error" });

};