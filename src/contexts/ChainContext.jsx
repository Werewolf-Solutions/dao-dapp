import React, { createContext, useContext, useState } from "react";
import { useAccount } from "wagmi";
import { getBalance, readContract } from "@wagmi/core";
import { formatUnits } from "viem";
import { config } from "../config.ts";

import { mockUSDT_ABI } from "../contracts/mockUSDT_ABI.ts";
import { werewolfToken_ABI } from "../contracts/werewolfToken_ABI.ts";
import { tokenSale_ABI } from "../contracts/tokenSale_ABI.ts";
import { dao_ABI } from "../contracts/dao_ABI.ts";
import { staking_ABI } from "../contracts/staking_ABI.ts";
import { companiesHouse_ABI } from "../contracts/companiesHouse_ABI.ts";

import contractsAddresses from "../utils/contracts-addresses.json";

// Create the context
const ChainContext = createContext(null);

export const ChainProvider = ({ children }) => {
  const account = useAccount();

  const [ETHBalance, setETHBalance] = useState(0);
  const [USDTBalance, setUSDTBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [tokenTotSupply, setTokenTotSupply] = useState(0);
  const [amountInTokenSale, setAmountInTokenSale] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [proposalCost, setProposalCost] = useState(0);
  const [wlfDecimals, setWlfDecimals] = useState(0);

  const [proposals, setProposals] = useState([]); // List of proposals

  const [wlfTokenABI, setWlfTokenABI] = useState(werewolfToken_ABI);
  const [usdtABI, setUsdtABI] = useState(mockUSDT_ABI);
  const [tokenSaleABI, setTokenSaleABI] = useState(tokenSale_ABI);
  const [daoABI, setDaoABI] = useState(dao_ABI);
  const [stakingABI, setStakingABI] = useState(staking_ABI);
  const [companiesHouseABI, setCompaniesHouseABI] =
    useState(companiesHouse_ABI);

  const getETHBalance = async () => {
    const account_balance = await getBalance(config, {
      address: account.address,
      chainId: account.chainId,
    });
    setETHBalance(account_balance);
  };

  const getTreasuryBalance = async () => {
    const chainId = account.chainId;
    const addresses = contractsAddresses[chainId];

    const decimals = await readContract(config, {
      abi: wlfTokenABI.abi,
      address: wlfTokenABI.address,
      functionName: "decimals",
    });

    setWlfDecimals(decimals);

    const rawBalance = await readContract(config, {
      abi: wlfTokenABI.abi,
      address: wlfTokenABI.address,
      functionName: "balanceOf",
      args: [addresses.Treasury],
    });

    const readableBalance = convertToReadableInput(rawBalance, decimals);
    console.log(readableBalance);

    setTreasuryBalance(readableBalance);
  };

  const getAmountInTokenSale = async () => {
    const decimals = await readContract(config, {
      abi: wlfTokenABI.abi,
      address: wlfTokenABI.address,
      functionName: "decimals",
    });

    const rawBalance = await readContract(config, {
      abi: wlfTokenABI.abi,
      address: wlfTokenABI.address,
      functionName: "balanceOf",
      args: [tokenSaleABI.address],
    });

    const readableBalance = convertToReadableInput(rawBalance, decimals);
    setAmountInTokenSale(readableBalance);
  };

  const getTokenBalance = async () => {
    const decimals = await readContract(config, {
      abi: wlfTokenABI.abi,
      address: wlfTokenABI.address,
      functionName: "decimals",
    });

    const rawBalance = await readContract(config, {
      abi: wlfTokenABI.abi,
      address: wlfTokenABI.address,
      functionName: "balanceOf",
      args: [account.address],
    });

    const readableBalance = convertToReadableInput(rawBalance, decimals);
    setTokenBalance(readableBalance);
  };

  const getTokenTotalSupply = async () => {
    const decimals = await readContract(config, {
      abi: wlfTokenABI.abi,
      address: wlfTokenABI.address,
      functionName: "decimals",
    });

    const rawSupply = await readContract(config, {
      abi: wlfTokenABI.abi,
      address: wlfTokenABI.address,
      functionName: "totalSupply",
    });

    const readableSupply = convertToReadableInput(rawSupply, decimals);
    setTokenTotSupply(readableSupply);
  };

  const getTokenPrice = async () => {
    const decimals = await readContract(config, {
      abi: wlfTokenABI.abi,
      address: wlfTokenABI.address,
      functionName: "decimals",
    });

    const rawPrice = await readContract(config, {
      abi: tokenSaleABI.abi,
      address: tokenSaleABI.address,
      functionName: "price",
    });

    const readablePrice = convertToReadableInput(rawPrice, decimals);
    setTokenPrice(readablePrice);
  };

  const loadTokenSaleContract = async () => {
    getAmountInTokenSale();
    getTokenPrice();
  };

  const getProposalCost = async () => {
    const rawBalance = await readContract(config, {
      abi: daoABI.abi,
      address: daoABI.address,
      functionName: "proposalCost",
    });
    const decimals = await readContract(config, {
      abi: wlfTokenABI.abi,
      address: wlfTokenABI.address,
      functionName: "decimals",
    });

    const readableBalance = convertToReadableInput(rawBalance, decimals);
    setProposalCost(rawBalance);
  };

  // Fetch proposals from the contract
  const fetchProposals = async () => {
    try {
      const fetchedProposals = [];

      const proposalCount = await readContract(config, {
        abi: daoABI.abi,
        address: daoABI.address,
        functionName: "proposalCount",
      });
      console.log(proposalCount);

      for (let i = 1; i < proposalCount; i++) {
        const proposal = await readContract(config, {
          abi: daoABI.abi,
          address: daoABI.address,
          functionName: "proposals",
          args: [i],
        });
        console.log(proposal);

        const proposalState = await readContract(config, {
          abi: daoABI.abi,
          address: daoABI.address,
          functionName: "getProposalState",
          args: [proposal[1]],
        });
        console.log(proposalState);

        fetchedProposals.push({
          id: Number(proposal[1]), // Convert to a number if `i` is not already
          state: proposalState,
          title: `Proposal #${proposal[1]}`, // Replace with the actual title if available
          votesFor: Number(proposal[3]), // Convert BigInt to a number
          votesAgainst: Number(proposal[4]), // Convert BigInt to a number
          proposer: proposal[2], // Address remains as a string
          // proposalState: proposal.proposalState, // Assuming this is already a readable value
          startTime: proposal[5], // Convert BigInt and transform to readable date
          endTime: proposal[6], // Convert BigInt and transform to readable date
          eta: Number(proposal[7]), // Convert BigInt to a number
        });
      }

      console.log(fetchedProposals);

      setProposals(fetchedProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  const importContractsAddresses = () => {
    const chainId = account.chainId;
    const addresses = contractsAddresses[chainId];

    usdtABI.address = addresses.USDT;
    tokenSaleABI.address = addresses.TokenSale;
    wlfTokenABI.address = addresses.WerewolfToken;
    daoABI.address = addresses.DAO;
    stakingABI.address = addresses.Staking;
    companiesHouseABI.address = addresses.CompaniesHouse;

    setUsdtABI(usdtABI);
    setWlfTokenABI(wlfTokenABI);
    setTokenSaleABI(tokenSaleABI);
    setDaoABI(daoABI);
    setStakingABI(stakingABI);
    setCompaniesHouseABI(companiesHouseABI);
  };

  const loadContracts = async () => {
    try {
      importContractsAddresses();
      await getTreasuryBalance();
      await getETHBalance();
      await getTokenBalance();
      await getTokenTotalSupply();
      await loadTokenSaleContract();
      await getProposalCost();
      await fetchProposals();
    } catch (error) {
      console.error(error);
    }
  };

  const contextValue = {
    tokenBalance: tokenBalance || null,
    tokenTotSupply: tokenTotSupply || null,
    ETHBalance: ETHBalance || null,
    amountInTokenSale: amountInTokenSale || null,
    tokenPrice: tokenPrice || null,
    account,
    usdtABI,
    tokenSaleABI,
    wlfTokenABI,
    daoABI,
    stakingABI,
    companiesHouseABI,
    treasuryBalance,
    proposalCost,
    proposals,
    wlfDecimals,
  };

  return (
    <ChainContext.Provider
      value={{
        ...contextValue,
        loadContracts,
        getTreasuryBalance,
        getProposalCost,
        fetchProposals,
        convertToReadableInput,
      }}
    >
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

const convertToReadableInput = (rawInput, decimals) => {
  const rawInputStr = rawInput.toString();
  const decimalsInt = parseInt(decimals, 10);

  if (rawInputStr.length > decimalsInt) {
    const wholePart = rawInputStr.slice(0, -decimalsInt);
    const fractionalPart = rawInputStr.slice(-decimalsInt);
    return `${wholePart}.${fractionalPart}`.replace(/\.?0+$/, ""); // Trim trailing zeros
  } else {
    const fractionalPart = rawInputStr.padStart(decimalsInt, "0");
    return `0.${fractionalPart}`.replace(/\.?0+$/, ""); // Trim trailing zeros
  }
};
