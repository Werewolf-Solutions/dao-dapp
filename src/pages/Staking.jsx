import React, { useState } from "react";

export default function Staking() {
  const [stakedAmount, setStakedAmount] = useState("");
  const [reward, setReward] = useState(0);

  const handleStake = () => {
    // Add logic to handle staking
    console.log("Stake:", stakedAmount);
  };

  const handleWithdraw = () => {
    // Add logic to handle withdrawal
    console.log("Withdraw rewards");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a202c] text-[#fff]">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Staking</h2>
        <p className="text-lg text-opacity-80 mb-6">
          Stake your tokens to earn rewards!
        </p>

        <div className="space-y-4">
          <input
            type="number"
            value={stakedAmount}
            onChange={(e) => setStakedAmount(e.target.value)}
            placeholder="Enter amount to stake"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-[#8e2421]"
          />
          <button
            onClick={handleStake}
            className="w-full px-4 py-2 bg-[#8e2421] text-white font-semibold rounded-lg shadow-lg hover:bg-[#8e25219d] transition-all"
          >
            Stake Tokens
          </button>
          <button
            onClick={handleWithdraw}
            className="w-full px-4 py-2 bg-[#8e2421] text-white font-semibold rounded-lg shadow-lg hover:bg-[#8e25219d] transition-all"
          >
            Withdraw Rewards
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold">Your Rewards</h3>
          <p className="text-lg text-opacity-80">{reward} Tokens</p>
        </div>
      </div>
    </div>
  );
}
