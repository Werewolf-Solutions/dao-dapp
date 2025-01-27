import React, { useState } from "react";
import { useChain } from "../contexts/ChainContext";
import { writeContract, readContract } from "@wagmi/core";
import { parseUnits } from "viem";
import { config } from "../config.ts";

function formatNumber(num) {
  // Convert to string in fixed-point notation with high precision
  const numberString = num.toFixed(20); // Arbitrary high precision

  // Extract the fractional part after the decimal point
  const fractionalPart = numberString.split(".")[1];

  // Count the number of zeros after "0."
  const zeroCount = fractionalPart.match(/^0*/)[0].length;

  // Calculate the appropriate precision (zero count + additional precision)
  const precision = zeroCount + 6;

  // Format the number with the desired precision and remove trailing zeros
  let formattedNumber = num.toFixed(precision);

  if (zeroCount === 20 || zeroCount === 0)
    formattedNumber = Number(formattedNumber).toFixed(3);

  // If it's a decimal number, remove trailing zeros in the fractional part
  // if (formattedNumber.includes(".")) {
  formattedNumber = formattedNumber.replace(/(\.\d*?[1-9])0+$/, "$1"); // Remove trailing zeros
  formattedNumber = formattedNumber.replace(/\.$/, ""); // Remove the trailing decimal point if no digits remain
  // }

  if (formattedNumber == 0) formattedNumber = 0;

  // console.log(`Number: ${num}`);
  // console.log(`Zeros after "0.": ${zeroCount}`);
  // console.log(`Formatted Number: ${formattedNumber}`);

  return formattedNumber;
}

export default function TokenSale() {
  const {
    ETHBalance,
    tokenBalance,
    amountInTokenSale,
    tokenPrice,
    account,
    usdtABI,
    tokenSaleABI,
    wlfTokenABI,
  } = useChain();

  const tokenOptions = {
    USDC: {
      name: "USDC",
      address: "0xUSDCAddress",
      abi: usdtABI.abi,
      decimals: 6,
      basePriceUSD: 1, // Base price in USD
    },
    USDT: {
      name: "USDT",
      address: usdtABI.address,
      abi: usdtABI.abi,
      decimals: 6,
      basePriceUSD: 1, // Base price in USD
    },
    ETH: {
      name: "ETH",
      address: null,
      abi: null,
      decimals: 18,
      basePriceUSD: 3200, // Base price in USD
    },
    WBTC: {
      name: "WBTC",
      address: "0xWBTCAddress",
      abi: usdtABI.abi,
      decimals: 8,
      basePriceUSD: 100000, // Base price in USD
    },
  };

  // State
  const [price, setPrice] = useState(Number(tokenPrice)); // ETH per token
  const [balance, setBalance] = useState(tokenBalance); // User's token balance
  const [totAmount, setTotAmount] = useState(amountInTokenSale); // Total tokens left
  const [amount, setAmount] = useState(1); // Amount of tokens to buy
  const [selectedToken, setSelectedToken] = useState("USDT"); // Default selected token
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wlfPrice, setWlfPrice] = useState(
    tokenPrice / tokenOptions["USDT"].basePriceUSD
  ); // Initial WLF price in USDT
  const [totalCost, setTotalCost] = useState(amount * wlfPrice);

  const handleAmountChange = (e) => {
    let newAmount = e.target.value;
    newAmount = Number(newAmount);

    if (newAmount <= 0) newAmount = ""; // Ensure amount is not negative or equal to 0

    setAmount(newAmount);
    let new_price =
      newAmount * (tokenPrice / tokenOptions[selectedToken].basePriceUSD);
    // console.log(new_price.toFixed(10));
    // console.log(newAmount, wlfPrice.toFixed(10));
    // console.log(newAmount * wlfPrice);
    let cost = formatNumber(new_price);
    setTotalCost(cost); // Recalculate total cost
  };

  const handleTokenChange = (e) => {
    const newToken = e.target.value;
    const basePriceUSD = tokenOptions[newToken].basePriceUSD;

    // Update WLF price and total cost based on new token
    const newWlfPrice = tokenPrice / basePriceUSD;
    setSelectedToken(newToken);
    setWlfPrice(newWlfPrice);
    setTotalCost(amount * newWlfPrice);
  };

  const handleBuyClick = async () => {
    const token = tokenOptions[selectedToken];
    const totalCostInUnits = parseUnits(totalCost.toString(), token.decimals);

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

    if (selectedToken === "ETH" && totalCost > ETHBalance.formatted) {
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

      // Approve token if required (for non-ETH tokens)
      if (selectedToken !== "ETH") {
        const balance = await readContract(config, {
          abi: token.abi,
          address: token.address,
          functionName: "balanceOf",
          args: [account.address],
        });
        if (balance < totalCostInUnits) {
          console.error("Insufficient token balance.");
          setMessage("Insufficient token balance.");
          setIsProcessing(false);
          setIsPopupOpen(true);
          return;
        }

        const allowance = await readContract(config, {
          abi: token.abi,
          address: token.address,
          functionName: "allowance",
          args: [account.address, tokenSaleABI.address],
        });

        if (allowance < totalCostInUnits) {
          await writeContract(config, {
            abi: token.abi,
            address: token.address,
            functionName: "approve",
            args: [tokenSaleABI.address, totalCostInUnits],
          });
        }
      }

      await writeContract(config, {
        abi: tokenSaleABI.abi,
        address: tokenSaleABI.address,
        functionName: "buyTokens",
        args: [
          Math.floor(amount * 10 ** token.decimals), // _amount
          wlfTokenABI.address, // token0 address
          token.address || "0x0000000000000000000000000000000000000000", // token1 (ETH if null)
          3000, // fee (example: 3000 basis points = 0.3%)
          -887220, // tickLower
          887220, // tickUpper
          Math.floor(totalCost * 10 ** token.decimals), // amount0Desired
          0, // amount1Desired
        ],
      });

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

    setTotalCost(price); // Reset cost input to default value
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
            WLF Price:
            <span className="font-semibold">
              {formatNumber(wlfPrice)} {selectedToken}
            </span>
          </p>
          <p>
            Total Cost:
            <span className="font-semibold">
              {totalCost} {selectedToken}
            </span>
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
          <span>Amount of tokens you want to buy: </span>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={handleAmountChange}
            className="w-full p-2 rounded-lg text-black outline-none mb-2"
            disabled={totAmount <= 0 || isProcessing}
          />
          Select token to buy with
          <select
            value={selectedToken}
            onChange={handleTokenChange}
            className="w-full p-2 rounded-lg text-black outline-none mb-2"
          >
            {Object.keys(tokenOptions).map((key) => (
              <option key={key} value={key}>
                {tokenOptions[key].name}
              </option>
            ))}
          </select>
          <div className="text-sm mb-4">
            = {totalCost} {selectedToken}
          </div>
          <button
            onClick={handleBuyClick}
            className={`py-2 px-4 font-semibold rounded-lg transition-all ${
              totAmount > 0 && !isProcessing
                ? "bg-[#8e2421] text-white hover:bg-[#8e25219d]"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            disabled={totAmount <= 0 || isProcessing}
          >
            {isProcessing
              ? "Processing..."
              : totAmount > 0
              ? `Buy ${amount} WLF Tokens with ${selectedToken}`
              : "Sold Out"}
          </button>
        </div>
        {isPopupOpen && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75"
            onClick={handleClosePopup}
          >
            <div className="bg-white text-black p-6 rounded-lg shadow-lg">
              <p>{message}</p>
              <button
                onClick={handleClosePopup}
                className="mt-4 py-1 px-2 rounded-lg bg-blue-600 text-white"
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
