const fs = require("fs");

function readLastCount() {
  try {
    const data = fs.readFileSync("database.json", { encoding: "utf-8" });
    return data && JSON.parse(data);
  } catch (error) {
    console.error("Error reead last count: ", error);
    return {};
  }
}

function writeLastCount(label, count) {
  try {
    fs.writeFileSync("database.json", JSON.stringify({ [label]: count }), {
      encoding: "utf-8",
    });
  } catch (error) {
    console.error("Error reead last count: ", error);
  }
}

module.exports = {
  readLastCount,
  writeLastCount,
};
