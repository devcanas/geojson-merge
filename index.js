var start = new Date().getTime();

const fs = require("fs");
const fetch = require("node-fetch");
const { rawListeners } = require("process");
const { sjs, attr } = require("slow-json-stringify");
const short = require("short-uuid");

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

let geojsonTemplate = {
  type: "FeatureCollection",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::3763" } },
  features: [],
};

const _writeFile = (geojson, properties) => {
  console.log("Writing file");
  fs.writeFile("riskIdq.js", stringify(geojson), (err, _) => console.log(err));
  fs.writeFile("properties.js", JSON.stringify(properties), (err, _) =>
    console.log(err)
  );
};

const mergeProps = (date, res) => {
  const geojson = { ...geojsonTemplate };
  let properties = {};
  fetch(
    `http://covid.vps.tecnico.ulisboa.pt/data/${date
      .split("-")
      .join("_")}_risk_idq.js`
  )
    .then((res) => res.json())
    .then((data) => {
      geojson.features = data.features.map((feat, idx) => {
        const uuid = short.generate();
        properties[uuid] = [
          ...res.map((r) => ({ date: r.date, ...r.data[idx] })),
        ];
        return {
          ...feat,
          properties: {
            data: uuid,
          },
        };
      });
      if (geojson.features.length === data.features.length)
        _writeFile(geojson, properties);
    });
};

const processProps = (dates) => {
  let res = [];
  let itemsProcessed = 0;

  const promises = dates.map((date) => {
    const filename = `http://covid.vps.tecnico.ulisboa.pt/data/${date
      .split("-")
      .join("_")}_risk_idq.js`;
    return fetch(filename).then((res) => res.json());
  });

  Promise.all(promises).then((values) => {
    values.forEach((data, idx) => {
      res = [
        {
          date: dates[idx],
          data: [...data.features.map((feat) => feat.properties)],
        },
        ...res,
      ];
      itemsProcessed++;
      if (itemsProcessed === dates.length) mergeProps(dates[0], res);
    });
  });
};

fetch("http://covid.vps.tecnico.ulisboa.pt/dates.php")
  .then((res) => res.json())
  .then(processProps);
// .catch(console.log);
