const fs = require("fs");
const stringify = require("./stringify");

const writeRiskFile = (geojson) => {
  console.log("> Writing features file...");
  fs.writeFile("riskIdq.js", stringify(geojson), (err, _) => {
    if (err) console.log(err);
    else console.log("> Done writing features file.");
  });
};

module.exports = writeRiskFile;
