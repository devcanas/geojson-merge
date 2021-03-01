const short = require("short-uuid");

const process = (geojsonList, file, dates, completion) => {
  const json = JSON.parse(file);
  console.log("> Processing files...");
  let values = [];
  const features = json.features.map((feature, featureIndex) => {
    const id = short.generate();
    geojsonList.forEach((geojson, geojsonIndex) => {
      // create new record for Properties
      const { Risk, IQD } = geojson.features[featureIndex].properties;
      const { date, isPred } = dates[geojsonIndex];
      values.push([id, `${date}`, Risk, IQD, isPred]);
    });
    return {
      ...feature,
      properties: {
        data: id,
      },
    };
  });
  json.features = features;
  completion(json, values);
};

module.exports = process;
