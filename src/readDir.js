var fs = require("fs");

const readDir = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`${dir} does not exist`);
    return;
  }

  var pattern = new RegExp("[0-9]*_[0-9]*_[0-9]*_risk_idq.js");
  return fs.readdirSync(dir).filter((file) => file.match(pattern));
};

module.exports = readDir;
