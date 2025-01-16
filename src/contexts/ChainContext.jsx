import React, { createContext, useContext, useState, useMemo } from "react";
import { useReadContract, useAccount } from "wagmi";
import { getBalance, readContract } from "@wagmi/core";
import { config } from "../config.ts";

import { tokenABI } from "../contracts/tokenABI.ts";
import { werewolfTokenABI } from "../contracts/werewolfTokenABI.ts";
import { tokenSaleABI } from "../contracts/tokenSaleABI.ts";

// Create the context
const ChainContext = createContext(null);

export const ChainProvider = ({ children }) => {
  const account = useAccount();

  const [ETHBalance, setETHBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokenTotSupply, setTokenTotSupply] = useState(0);
  const [amountInTokenSale, setAmountInTokenSale] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);

  const getETHBalance = async () => {
    const account_balance = await getBalance(config, {
      address: account.address,
      chainId: account.chainId,
    });
    // console.log(account_balance);

    setETHBalance(account_balance);
  };

  const getTokenBalance = async () => {
    try {
      // Fetch the token's decimals
      const decimals = await readContract(config, {
        abi: werewolfTokenABI.abi,
        address: werewolfTokenABI.address,
        functionName: "decimals",
      });
      // console.log(`Token Decimals: ${decimals}`);

      // Fetch the raw balance as BigInt
      const rawBalance = await readContract(config, {
        abi: werewolfTokenABI.abi,
        address: werewolfTokenABI.address,
        functionName: "balanceOf",
        args: [account.address],
      });

      // console.log(`Raw Balance (BigInt): ${rawBalance}`);

      // Convert raw balance to human-readable format as a string
      const rawBalanceStr = rawBalance.toString();
      const decimalsInt = parseInt(decimals, 10);

      let readableBalance;
      if (rawBalanceStr.length > decimalsInt) {
        const wholePart = rawBalanceStr.slice(0, -decimalsInt); // Whole number part
        const fractionalPart = rawBalanceStr.slice(-decimalsInt); // Fractional part
        readableBalance = `${wholePart}.${fractionalPart}`.replace(
          /\.?0+$/,
          ""
        ); // Trim trailing zeros
      } else {
        const fractionalPart = rawBalanceStr.padStart(decimalsInt, "0"); // Pad with leading zeros if needed
        readableBalance = `0.${fractionalPart}`.replace(/\.?0+$/, ""); // Trim trailing zeros
      }

      // console.log(`Readable Balance: ${readableBalance}`);

      // Set the token balance
      setTokenBalance(readableBalance);
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  const getAmountInTokenSale = async () => {
    const decimals = await readContract(config, {
      abi: werewolfTokenABI.abi,
      address: werewolfTokenABI.address,
      functionName: "decimals",
    });
    const rawBalance = await readContract(config, {
      abi: werewolfTokenABI.abi,
      address: werewolfTokenABI.address,
      functionName: "balanceOf",
      args: [tokenSaleABI.address],
    });
    console.log(rawBalance);

    // console.log(`Raw Balance (BigInt): ${rawBalance}`);

    // Convert raw balance to human-readable format as a string
    const rawBalanceStr = rawBalance.toString();
    const decimalsInt = parseInt(decimals, 10);

    let readableBalance;
    if (rawBalanceStr.length > decimalsInt) {
      const wholePart = rawBalanceStr.slice(0, -decimalsInt); // Whole number part
      const fractionalPart = rawBalanceStr.slice(-decimalsInt); // Fractional part
      readableBalance = `${wholePart}.${fractionalPart}`.replace(/\.?0+$/, ""); // Trim trailing zeros
    } else {
      const fractionalPart = rawBalanceStr.padStart(decimalsInt, "0"); // Pad with leading zeros if needed
      readableBalance = `0.${fractionalPart}`.replace(/\.?0+$/, ""); // Trim trailing zeros
    }

    // console.log(`Readable Balance: ${readableBalance}`);

    // Set the token balance
    setAmountInTokenSale(readableBalance);
  };

  const getTokenTotalSupply = async () => {
    try {
      // Fetch the token's decimals
      const decimals = await readContract(config, {
        abi: werewolfTokenABI.abi,
        address: werewolfTokenABI.address,
        functionName: "decimals",
      });

      // Fetch the total supply as BigInt
      const rawSupply = await readContract(config, {
        abi: werewolfTokenABI.abi,
        address: werewolfTokenABI.address,
        functionName: "totalSupply",
      });

      // Convert raw supply to human-readable format as a string
      const rawSupplyStr = rawSupply.toString();
      const decimalsInt = parseInt(decimals, 10);

      let readableSupply;
      if (rawSupplyStr.length > decimalsInt) {
        const wholePart = rawSupplyStr.slice(0, -decimalsInt); // Whole number part
        const fractionalPart = rawSupplyStr.slice(-decimalsInt); // Fractional part
        readableSupply = `${wholePart}.${fractionalPart}`.replace(/\.?0+$/, ""); // Trim trailing zeros
      } else {
        const fractionalPart = rawSupplyStr.padStart(decimalsInt, "0"); // Pad with leading zeros if needed
        readableSupply = `0.${fractionalPart}`.replace(/\.?0+$/, ""); // Trim trailing zeros
      }
      // console.log(readableSupply);

      // Set the token total supply
      setTokenTotSupply(readableSupply);
    } catch (error) {
      console.error("Error fetching token total supply:", error);
    }
  };

  const getTokenPrice = async () => {
    const decimals = await readContract(config, {
      abi: werewolfTokenABI.abi,
      address: werewolfTokenABI.address,
      functionName: "decimals",
    });
    const rawPrice = await readContract(config, {
      abi: tokenSaleABI.abi,
      address: tokenSaleABI.address,
      functionName: "price",
    });
    console.log(rawPrice);

    // Convert raw price to human-readable format as a string
    const rawPriceStr = rawPrice.toString();
    const decimalsInt = parseInt(decimals, 10);

    let readablePrice;
    if (rawPriceStr.length > decimalsInt) {
      const wholePart = rawPriceStr.slice(0, -decimalsInt); // Whole number part
      const fractionalPart = rawPriceStr.slice(-decimalsInt); // Fractional part
      readablePrice = `${wholePart}.${fractionalPart}`.replace(/\.?0+$/, ""); // Trim trailing zeros
    } else {
      const fractionalPart = rawPriceStr.padStart(decimalsInt, "0"); // Pad with leading zeros if needed
      readablePrice = `0.${fractionalPart}`.replace(/\.?0+$/, ""); // Trim trailing zeros
    }
    setTokenPrice(readablePrice);
  };

  const loadTokenSaleContract = async () => {
    getAmountInTokenSale();
    getTokenPrice();
  };

  // loadContracts function
  const loadContracts = async () => {
    try {
      await getETHBalance(); // TODO: move it somewhere else

      await getTokenBalance();

      await getTokenTotalSupply();

      await loadTokenSaleContract();
    } catch (error) {
      console.error(error);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      loadContracts,
      tokenBalance: tokenBalance ? tokenBalance : null,
      tokenTotSupply: tokenTotSupply ? tokenTotSupply : null,
      ETHBalance: ETHBalance ? ETHBalance : null,
      amountInTokenSale: amountInTokenSale ? amountInTokenSale : null,
      tokenPrice: tokenPrice ? tokenPrice : null,
    }),
    [
      loadContracts,
      tokenBalance,
      ETHBalance,
      tokenTotSupply,
      amountInTokenSale,
      tokenPrice,
    ]
  );

  return (
    <ChainContext.Provider value={contextValue}>
      {children}
    </ChainContext.Provider>
  );
};

// Custom hook to access the ChainContext
export const useChain = () => {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error("useChain must be used within a ChainProvider");
  }
  return context;
};
