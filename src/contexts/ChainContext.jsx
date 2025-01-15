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

  const getETHBalance = async () => {
    const account_balance = await getBalance(config, {
      address: account.address,
      chainId: account.chainId,
    });
    // console.log(account_balance);

    setETHBalance(account_balance);
  };

  // loadContracts function
  const loadContracts = async () => {
    try {
      getETHBalance(); // TODO: move it somewhere else

      // Get MTK balance of account
      const data = await readContract(config, {
        abi: tokenABI.abi,
        address: tokenABI.address,
        functionName: "balanceOf",
        args: [account.address],
      });
      console.log(data);

      // Total supply of MTK token
      const result = await readContract(config, {
        abi: tokenABI.abi,
        address: tokenABI.address,
        functionName: "totalSupply",
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      loadContracts,
      tokenBalance: tokenBalance ? tokenBalance.toString() : null,
      ETHBalance,
    }),
    [loadContracts, tokenBalance, ETHBalance]
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
