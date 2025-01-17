import React, { useState } from "react";
import { useChain } from "../contexts/ChainContext";
import { writeContract, readContract } from "@wagmi/core";
// import { useWriteContract } from "wagmi";
import { config } from "../config.ts";

import { mockUSDT_ABI } from "../contracts/mockUSDT_ABI.ts";
import { werewolfTokenABI } from "../contracts/werewolfTokenABI.ts";
import { tokenSaleABI } from "../contracts/tokenSaleABI.ts";

const decimals = 18;

function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

export default function TokenSale() {
  const { ETHBalance, tokenBalance, amountInTokenSale, tokenPrice, account } =
    useChain();

  // const { writeContract } = useWriteContract({
  //   config,
  // });

  // State
  const [price, setPrice] = useState(Number(tokenPrice)); // ETH per token
  const [balance, setBalance] = useState(tokenBalance); // User's token balance
  const [totAmount, setTotAmount] = useState(amountInTokenSale); // Total tokens left
  const [amount, setAmount] = useState(1); // Amount of tokens to buy
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    setAmount(Number(e.target.value));
  };

  const handleBuyClick = async () => {
    const totalCost = amount * price;

    if (totAmount <= 0) {
      setMessage("Tokens are sold out!");
      setIsPopupOpen(true);
      return;
    }

    if (amount <= 0) {
      setMessage("Enter a valid token amount.");
      setIsPopupOpen(true);
      return;
    }

    if (totalCost > ETHBalance.formatted) {
      setMessage("Insufficient ETH balance.");
      setIsPopupOpen(true);
      return;
    }

    if (amount > totAmount) {
      setMessage("Not enough tokens available.");
      setIsPopupOpen(true);
      return;
    }

    try {
      setIsProcessing(true);
      // Validate input
      if (amount <= 0) throw new Error("Amount must be greater than 0.");
      if (totalCost > ETHBalance.raw)
        throw new Error("Insufficient ETH balance.");

      // Approve token if required (for mockUSDT)
      const allowanceUSDT = await readContract(config, {
        abi: mockUSDT_ABI.abi,
        address: mockUSDT_ABI.address,
        functionName: "allowance",
        args: [account.address, tokenSaleABI.address],
      });

      console.log(allowanceUSDT);

      // Approve token if required (for werewolfToken)
      const allowanceWLF = await readContract(config, {
        abi: werewolfTokenABI.abi,
        address: werewolfTokenABI.address,
        functionName: "allowance",
        args: [account.address, tokenSaleABI.address],
      });

      console.log(allowanceWLF);

      console.log(allowanceUSDT < totalCost);
      if (allowanceUSDT < totalCost) {
        const approveUSDT = await writeContract(config, {
          abi: mockUSDT_ABI.abi,
          address: mockUSDT_ABI.address,
          functionName: "approve",
          args: [tokenSaleABI.address, totalCost],
        });
        console.log(approveUSDT);
      }

      if (allowanceWLF < totalCost) {
        await writeContract(config, {
          abi: werewolfTokenABI.abi,
          address: werewolfTokenABI.address,
          functionName: "approve",
          args: [tokenSaleABI.address, totalCost],
        });
      }

      const tx = await writeContract(config, {
        abi: tokenSaleABI.abi,
        address: tokenSaleABI.address,
        functionName: "buyTokens",
        args: [
          Math.floor(amount * 10 ** decimals), // _amount
          werewolfTokenABI.address, // Replace with actual token0 address
          mockUSDT_ABI.address, // Replace with actual token1 address
          3000, // fee (example: 3000 basis points = 0.3%)
          -887220, // tickLower (example, replace with actual tick)
          887220, // tickUpper (example, replace with actual tick)
          Math.floor(totalCost * 10 ** decimals), // amount0Desired
          0, // amount1Desired (for single-token purchase, this can be 0)
        ],
      });

      console.log(tx);

      await tx.wait(); // Wait for transaction confirmation

      // Update balances after successful transaction
      setBalance((prev) => prev + amount);
      setTotAmount((prev) => prev - amount);
      setMessage("Purchase successful!");
    } catch (error) {
      console.error("Error during purchase:", error);
      setMessage("Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
      setIsPopupOpen(true);
    }

    setAmount(0); // Reset input
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a202c] text-[#fff]">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to the Token Sale</h2>
        <div className="text-left space-y-2">
          <p>
            Price:{" "}
            <span className="font-semibold">{formatNumber(price)} ETH</span>
          </p>
          <p>
            ETH Balance:{" "}
            <span className="font-semibold">{ETHBalance?.formatted} ETH</span>
          </p>
          <p>
            Token Balance: <span className="font-semibold">{tokenBalance}</span>
          </p>
          <p>
            Tokens Left: <span className="font-semibold">{totAmount}</span>
          </p>
        </div>
        <div className="mt-6">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg text-black outline-none mb-2"
            disabled={totAmount <= 0 || isProcessing}
          />
          <div className="text-sm mb-4">= {amount * price} ETH</div>
          <button
            onClick={handleBuyClick}
            className={`w-full font-semibold py-2 rounded-lg transition-all ${
              totAmount > 0 && !isProcessing
                ? "bg-[#8e2421] text-white hover:bg-[#8e25219d]"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            disabled={totAmount <= 0 || isProcessing}
          >
            {isProcessing
              ? "Processing..."
              : totAmount > 0
              ? "Buy Tokens"
              : "Sold Out"}
          </button>
        </div>
        {isPopupOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleClosePopup}
          >
            <div
              className="bg-gray-800 p-4 rounded-lg text-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p>{message}</p>
              <button
                className="mt-4 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 transition-all"
                onClick={handleClosePopup}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
