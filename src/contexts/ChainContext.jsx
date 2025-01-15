import React, { createContext, useContext, useState, useMemo } from "react";
import { useReadContract, useAccount } from "wagmi";
import { sepolia } from "wagmi/chains";
import { getBalance, readContract } from "@wagmi/core";
import { config } from "../config.ts";

import { tokenABI } from "../contracts/tokenABI.ts";

// Create the context
const ChainContext = createContext(null);

export const ChainProvider = ({ children }) => {
  const account = useAccount();

  const [ETHBalance, setETHBalance] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [tokenTotSupply, setTokenTotSupply] = useState();

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
        abi: tokenABI.abi,
        address: tokenABI.address,
        functionName: "decimals",
      });
      // console.log(`Token Decimals: ${decimals}`);

      // Fetch the raw balance as BigInt
      const rawBalance = await readContract(config, {
        abi: tokenABI.abi,
        address: tokenABI.address,
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

  const getTokenTotalSupply = async () => {
    try {
      // Fetch the token's decimals
      const decimals = await readContract(config, {
        abi: tokenABI.abi,
        address: tokenABI.address,
        functionName: "decimals",
      });

      // Fetch the total supply as BigInt
      const rawSupply = await readContract(config, {
        abi: tokenABI.abi,
        address: tokenABI.address,
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

  // loadContracts function
  const loadContracts = async () => {
    try {
      await getETHBalance(); // TODO: move it somewhere else

      await getTokenBalance();

      await getTokenTotalSupply();
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
    }),
    [loadContracts, tokenBalance, ETHBalance, tokenTotSupply]
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
