const createDBConnection = require("./db");

const insertPropertiesInDB = (values) => {
  const db = createDBConnection();
  db.connect();
  console.log("> Populating db with properties...");
  const queryString = `insert into property (uuid, date, risk, iqd) values ?`;
  db.query(queryString, [values], (err) => {
    if (err) console.log(err);
    console.log("> Done!");
    db.end();
  });
};

module.exports = insertPropertiesInDB;
