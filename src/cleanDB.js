const createDBConnection = require("./db");

const cleanDB = (completion) => {
  const db = createDBConnection();
  db.connect();
  console.log("> Cleaning db");
  const queryString = "delete from property where 1 = 1;";
  db.query(queryString, (err) => {
    if (err) console.log(err);
    console.log("> Done cleaning db.");
    completion();
    db.end();
  });
};

module.exports = cleanDB;
