var path = require("path");
var fs = require("fs");
const short = require("short-uuid");
const readDir = require("./readDir");
const fetchFiles = require("./fetchFiles");
const createDBConnection = require("./db");
const { exit } = require("process");

const { sjs, attr } = require("slow-json-stringify");

//- ---- scripts
// this
// readDir
// fetchFiles

const datesMap = (file) => file.split("_").slice(0, 3).join("-");

const files = readDir("data"); // gets all geojson files
const dates = files.map(datesMap); // gets all the dates from the file names

const file = fs.readFileSync("data/2020_10_21_risk_idq.js");
const json = JSON.parse(file);

const stringify = sjs({
  type: attr("string"),
  name: attr("string"),
  crs: { type: attr("string"), properties: { name: attr("string") } },
  features: attr(
    "array",
    sjs({
      type: attr("string"),
      properties: {
        data: attr("string"),
      },
      geometry: {
        type: attr("string"),
        coordinates: attr("array"),
      },
    })
  ),
});

const _writeFile = (geojson) => {
  console.log("> Writing features file...");
  fs.writeFile("riskIdq.js", stringify(geojson), (err, _) => {
    if (err) console.log(err);
    else console.log("> Done writing features file.");
  });
};

const process = (geojsonList) => {
  console.log("> Processing files...");
  let values = [];
  const features = json.features.map((feature, featureIndex) => {
    const id = short.generate();
    geojsonList.forEach((geojson, geojsonIndex) => {
      // create new record for Properties
      const { Risk, IQD } = geojson.features[featureIndex].properties;
      values.push([id, `${dates[geojsonIndex]}`, Risk, IQD]);
    });
    return {
      ...feature,
      properties: {
        data: id,
      },
    };
  });

  json.features = features;
  _writeFile(json);
  insertPropertiesInDB(values);
};

const insertPropertiesInDB = (values) => {
  console.log("> Populating db with properties...");
  const db = createDBConnection();
  db.connect();
  const queryString = `insert into property (uuid, date, risk, iqd) values ?`;
  db.query(queryString, [values], (err) => {
    if (err) console.log(err);
    console.log("> Done!");
    db.end();
  });
};

console.log("> Fetching geojson files...");
fetchFiles(files).then(process);
