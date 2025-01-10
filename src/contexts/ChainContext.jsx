import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useDeployContract, useReadContract, useAccount } from "wagmi";
import { sepolia } from "wagmi/chains";
import { getBalance, readContract } from "@wagmi/core";
import { getConfig } from "../config.ts";

import { tokenABI } from "../contracts/tokenABI.ts";
import { wagmiAbi } from "../contracts/abi.ts";

// Create the context
const ChainContext = createContext(null);

export const ChainProvider = ({ children }) => {
  const { deployContract } = useDeployContract();
  const account = useAccount();

  const [ETHBalance, setETHBalance] = useState();
  const [tokenBalance, setTokenBalance] = useState();

  console.log(account);

  // // Get balance of account
  // const { data, isLoading, error } = useReadContract({
  //   ...tokenABI,
  //   functionName: "balanceOf",
  //   args: [account.address],
  // });
  // console.log(data);

  const getETHBalance = async () => {
    const account_balance = await getBalance(getConfig(), {
      address: account.address,
      chainId: account.chainId,
    });
    console.log(account_balance);

    setETHBalance(account_balance);
  };

  // Memoize the deployContracts function
  const deployContracts = useCallback(async () => {
    try {
      // Deploy wagmiAbi contract? TODO: can it be removed?
      deployContract({
        abi: wagmiAbi,
        bytecode:
          "0x608060405260405161083e38038061083e833981016040819052610...",
      });

      // Get MTK balance of account
      const data = await readContract(getConfig(), {
        abi: tokenABI.abi,
        address: tokenABI.address,
        functionName: "balanceOf",
        args: [account.address],
      });
      console.log(data);

      // Total supply of MTK token
      const result = await readContract(getConfig(), {
        abi: tokenABI.abi,
        address: tokenABI.address,
        functionName: "totalSupply",
      });
      console.log(result);

      getETHBalance(); // TODO: move it somewhere else
    } catch (error) {
      console.error(error);
    }
  }, [deployContract]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      deployContracts,
      tokenBalance: tokenBalance ? tokenBalance.toString() : null,
      ETHBalance,
    }),
    [deployContracts, tokenBalance, ETHBalance]
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
