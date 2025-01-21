const fs = require("fs");
const path = require("path");

//const filePath = path.join(__dirname, 'test-data.txt');  // Ensure it's in the same folder as the script
const filePath = path.resolve(
  __dirname,
  "../../dao-project/script/output/deployed-addresses.txt"
);
const outputFilePath = path.join(__dirname, "contracts-addresses.json"); // Output JSON will be saved in the same folder
// Function to parse the file and create an object
function parseFileToObject(filePath) {
  console.log("filepath", filePath);
  console.log("outputFilePath", outputFilePath);
  fs.readFile(outputFilePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading the JSON file:", err);
      return;
    }

    let jsonObject = {};

    // If the JSON file exists, parse the data
    if (data) {
      try {
        jsonObject = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing the JSON file:", parseError);
        return;
      }
    }
    fs.readFile(filePath, "utf8", (err, txtData) => {
      if (err) {
        console.error("Error reading the file:", err);
        return;
      }
      const contractAddress = {};
      const lines = txtData.split("\n"); // Split by new lines
      const chainId = lines[0].split(":")[1].trim();

      lines.forEach((line) => {
        const [key, value] = line.split(":"); // Split by colon
        if (key && value) {
          contractAddress[key.trim()] = value.trim();
        }
      });

      jsonObject[chainId] = { ...jsonObject[chainId], ...contractAddress };

      fs.writeFile(
        outputFilePath,
        JSON.stringify(jsonObject, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing the JSON file:", err);
          } else {
            console.log("Object successfully written to JSON file!");
          }
        }
      );
    });
  });
}
parseFileToObject(filePath);
