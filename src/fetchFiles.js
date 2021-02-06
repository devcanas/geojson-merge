const fetch = require("node-fetch");

const endpointForFile = (file) => {
  return `http://covid.vps.tecnico.ulisboa.pt/data/${file}`;
};

const promisesForFiles = (files) => {
  return files.map((file) =>
    fetch(endpointForFile(file)).then((res) => res.json())
  );
};

const fetchFiles = (files) => {
  console.log("> Fetching geojson files...");
  return Promise.all(promisesForFiles(files));
};

module.exports = fetchFiles;
