const db = require("./../db/connection.js");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;")
  .then((result) => {
    return result.rows;
  });
};

exports.selectUserById = (username) => {
  return db.query(`SELECT * FROM users WHERE username = '${username}';`)
  .then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject("User not found.");
    }
    return result.rows[0];
  });
};
