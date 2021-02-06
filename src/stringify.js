const { sjs, attr } = require("slow-json-stringify");

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

module.exports = stringify;
