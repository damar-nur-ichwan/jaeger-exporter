const { appendFileSync, writeFileSync } = require("fs");
function UpdatedAt(timestamp = 0) {
  appendFileSync("data/UpdatedAt.json", JSON.stringify(timestamp));
  writeFileSync("data/UpdatedAt.json", JSON.stringify(timestamp));
}

module.exports = UpdatedAt;
