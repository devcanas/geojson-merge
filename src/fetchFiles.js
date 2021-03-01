const fs = require("fs");
const fetch = require("node-fetch");

const endpointForFile = (file) => {
  return `${process.env.DATA_DIR}/${file}`;
};

const promisesForFiles = (files) => {
  return files.map((file) =>
    fs.promises.readFile(endpointForFile(file)).then((res) => JSON.parse(res))
  );
};

const fetchFiles = (files) => {
  console.log("> Fetching geojson files...");
  return Promise.all(promisesForFiles(files));
};

module.exports = fetchFiles;
