import React, { useState } from "react";

function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

export default function TokenSale() {
  // State
  const [price] = useState(0.05); // ETH per token
  const [ETHbalance, setETHbalance] = useState(2.0); // User's ETH balance
  const [balance, setBalance] = useState(0); // User's token balance
  const [totAmount, setTotAmount] = useState(1000); // Total tokens left
  const [amount, setAmount] = useState(1); // Amount of tokens to buy
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleInputChange = (e) => {
    setAmount(Number(e.target.value));
  };

  const handleBuyClick = () => {
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

    if (totalCost > ETHbalance) {
      setMessage("Insufficient ETH balance.");
      setIsPopupOpen(true);
    } else if (amount > totAmount) {
      setMessage("Not enough tokens available.");
      setIsPopupOpen(true);
    } else {
      // Update balances
      setETHbalance((prev) => prev - totalCost);
      setBalance((prev) => prev + amount);
      setTotAmount((prev) => prev - amount);
      setMessage("Purchase successful!");
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
            <span className="font-semibold">{ETHbalance.toFixed(2)} ETH</span>
          </p>
          <p>
            Token Balance:{" "}
            <span className="font-semibold">{formatNumber(balance)}</span>
          </p>
          <p>
            Tokens Left:{" "}
            <span className="font-semibold">{formatNumber(totAmount)}</span>
          </p>
        </div>
        <div className="mt-6">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg text-black outline-none mb-2"
            disabled={totAmount <= 0}
          />
          <div className="text-sm mb-4">= {amount * price} ETH</div>
          <button
            onClick={handleBuyClick}
            className={`w-full font-semibold py-2 rounded-lg transition-all ${
              totAmount > 0
                ? "bg-[#8e2421] text-white hover:bg-[#8e25219d]"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            disabled={totAmount <= 0}
          >
            {totAmount > 0 ? "Buy Tokens" : "Sold Out"}
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
