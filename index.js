var path = require("path");
var fs = require("fs");
const fetchFiles = require("./src/fetchFiles");

// helper functions
const process = require("./src/process");
const writeRiskFile = require("./src/writeRiskFile");
const insertPropertiesInDB = require("./src/insertPropertiesInDB");
const readDir = require("./src/readDir");
const cleanDB = require("./src/cleanDB");
const datesMap = (file) => {
  let tokens = file.split("_");
  const dateTokens =
    tokens[0] === "pred" ? tokens.slice(1, 4) : tokens.slice(0, 3);
  const res = { date: dateTokens.join("-"), isPred: tokens[0] === "pred" };
  return res;
};

// reading and preparing data
const files = readDir("data");
const dates = files.map(datesMap);
const file = fs.readFileSync("data/2020_10_21_risk_idq.js"); // can be any file as long as it exists

cleanDB(() => {
  fetchFiles(files)
    .then((geojsonList) => {
      process(geojsonList, file, dates, (json, values) => {
        writeRiskFile(json);
        insertPropertiesInDB(values);
      });
    })
    .catch((err) => console.log(err));
});
