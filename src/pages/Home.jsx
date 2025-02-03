import React, { useState } from "react";
import { Link } from "react-router-dom";

import { decodeAbiParameters, encodeAbiParameters, parseUnits } from "viem";

export default function Home() {
  const [encoded, setEncoded] = useState("");

  const handleChange = (e) => {
    setEncoded(e.target.value);
  };

  const decode = () => {
    try {
      const decodedValue = decodeAbiParameters(
        [{ name: "amount", type: "uint256" }], // Match the encoding structure
        [encoded]
      );

      console.log("Decoded Value:", decodedValue); // Extract the uint256 value
    } catch (error) {
      console.error("Decoding failed:", error);
      alert("Invalid encoded data");
    }
  };

  const encode = () => {
    try {
      const mintAmount = parseUnits("1000000", 18); // 1000000 WLF
      const encodedValue = encodeAbiParameters(
        [{ name: "amount", type: "uint256" }],
        [mintAmount]
      );

      console.log("Encoded Value:", encodedValue); // Extract the uint256 value
    } catch (error) {
      console.error("Decoding failed:", error);
      alert("Invalid encoded data");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a202c] text-[#fff]">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-wide">
          Welcome to Token Sale & DAO Tester
        </h1>
        <p className="text-lg text-opacity-80">
          Explore and test token sales, interact with DAO contracts, and join
          our community.
        </p>
      </div>

      <main className="flex flex-col items-center gap-4 mt-8">
        <Link
          to="/token-sale"
          className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d]  font-semibold rounded-lg shadow-lg transition-all"
        >
          Token Sale
        </Link>
        <Link
          to="/dao"
          className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d] font-semibold rounded-lg shadow-lg transition-all"
        >
          DAO Contracts
        </Link>
      </main>

      {/* <div className="flex flex-col justify-center items-center mt-12">
        <h1>Decode</h1>
        <input
          type="text"
          name="encodedValue"
          onChange={handleChange}
          value={encoded}
          className="text-black"
        />
        <button onClick={decode}>Decode</button>
      </div>

      <div className="flex flex-col justify-center items-center mt-12">
        <h1>Encode</h1>
        <button onClick={encode}>Encode</button>
      </div> */}
    </div>
  );
}
