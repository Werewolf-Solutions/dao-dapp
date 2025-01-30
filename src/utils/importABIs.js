const fs = require("fs");
const path = require("path");

const contractsFile = "./contracts-addresses.json";
const contractsDir = "../../../dao-project/out/";
const outputDir = "./src/contracts/";

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Utility function to format the ABI in a clean way
function formatObject(obj, indent = 2) {
  return JSON.stringify(obj, null, indent)
    .replace(/"(\w+)":/g, "$1:") // Remove quotes from keys
    .replace(/"/g, "'"); // Convert double quotes to single quotes
}

// Function to transform ABI into TypeScript format
function transformABI(contractName, contractAddress, abi) {
  return `export const ${contractName}Contract = {
  address: '${contractAddress}',
  abi: ${formatObject(abi, 4)}
};`;
}

// Read contract addresses file
fs.readFile(contractsFile, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading contracts file:", err);
    return;
  }

  const contractsData = JSON.parse(data)["31337"]; // Using Chain ID 31337

  // Process each contract
  Object.entries(contractsData).forEach(([name, address]) => {
    if (name === "Chain ID") return; // Skip "Chain ID" key

    const contractFilePath = path.resolve(
      contractsDir,
      `${name}.sol/${name}.json`
    );
    const outputFilePath = path.join(
      outputDir,
      `${name.toLowerCase()}Contract.ts`
    );

    // Read each contract's ABI
    fs.readFile(contractFilePath, "utf8", (err, jsonData) => {
      if (err) {
        console.error(`Error reading ABI for ${name}:`, err);
        return;
      }

      const parsedData = JSON.parse(jsonData);
      const abi = parsedData.abi;
      const tsOutput = transformABI(name, address, abi);

      // Write the TypeScript file
      fs.writeFile(outputFilePath, tsOutput, "utf8", (err) => {
        if (err) {
          console.error(`Error writing file for ${name}:`, err);
          return;
        }
        console.log(`✅ Successfully generated ${outputFilePath}`);
      });
    });
  });
});
