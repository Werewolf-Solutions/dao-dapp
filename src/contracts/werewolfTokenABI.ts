import addresses from "../utils/contracts-addresses.json";

// TODO: Handle different chain
const chainId = "31337";

export const werewolfTokenABI = {
  address: addresses[chainId].WerewolfToken,
  abi: [
    {
      type: "function",
      name: "_authorizeCaller",
      stateMutability: "nonpayable",
      inputs: [{ name: "_caller", type: "address", internalType: "address" }],
      outputs: [],
    },
    {
      type: "function",
      name: "_deauthorizeCaller",
      stateMutability: "nonpayable",
      inputs: [{ name: "_caller", type: "address", internalType: "address" }],
      outputs: [],
    },
    {
      type: "function",
      name: "airdrop",
      stateMutability: "nonpayable",
      inputs: [
        { name: "to", type: "address", internalType: "address" },
        { name: "amount", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
    },
    {
      type: "function",
      name: "allowance",
      stateMutability: "view",
      inputs: [
        { name: "owner", type: "address", internalType: "address" },
        { name: "spender", type: "address", internalType: "address" },
      ],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    },
    {
      type: "function",
      name: "approve",
      stateMutability: "nonpayable",
      inputs: [
        { name: "spender", type: "address", internalType: "address" },
        { name: "value", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
    },
    {
      type: "function",
      name: "authorizedCallers",
      stateMutability: "view",
      inputs: [{ name: "", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
    },
    {
      type: "function",
      name: "balanceOf",
      stateMutability: "view",
      inputs: [{ name: "account", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    },
    {
      type: "function",
      name: "checkpoints",
      stateMutability: "view",
      inputs: [
        { name: "", type: "address", internalType: "address" },
        { name: "", type: "uint32", internalType: "uint32" },
      ],
      outputs: [
        { name: "fromBlock", type: "uint32", internalType: "uint32" },
        { name: "votes", type: "uint96", internalType: "uint96" },
      ],
    },
    {
      type: "function",
      name: "decimals",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
    },
    {
      type: "function",
      name: "getPriorVotes",
      stateMutability: "view",
      inputs: [
        { name: "account", type: "address", internalType: "address" },
        { name: "blockNumber", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "uint96", internalType: "uint96" }],
    },
    {
      type: "function",
      name: "initialize",
      stateMutability: "nonpayable",
      inputs: [
        { name: "_owner", type: "address", internalType: "address" },
        { name: "_treasury", type: "address", internalType: "address" },
        { name: "_timelock", type: "address", internalType: "address" },
        { name: "_addr1", type: "address", internalType: "address" },
        { name: "_addr2", type: "address", internalType: "address" },
      ],
      outputs: [],
    },
    {
      type: "function",
      name: "mint",
      stateMutability: "nonpayable",
      inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
      outputs: [],
    },
    {
      type: "function",
      name: "name",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "string", internalType: "string" }],
    },
    {
      type: "function",
      name: "numCheckpoints",
      stateMutability: "view",
      inputs: [{ name: "", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "uint32", internalType: "uint32" }],
    },
    {
      type: "function",
      name: "owner",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
    },
    {
      type: "function",
      name: "payEmployee",
      stateMutability: "nonpayable",
      inputs: [
        { name: "to", type: "address", internalType: "address" },
        { name: "amount", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
    },
    {
      type: "function",
      name: "renounceOwnership",
      stateMutability: "nonpayable",
      inputs: [],
      outputs: [],
    },
    {
      type: "function",
      name: "setTreasury",
      stateMutability: "nonpayable",
      inputs: [{ name: "_treasury", type: "address", internalType: "address" }],
      outputs: [],
    },
    {
      type: "function",
      name: "symbol",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "string", internalType: "string" }],
    },
    {
      type: "function",
      name: "timelock",
      stateMutability: "view",
      inputs: [],
      outputs: [
        { name: "", type: "address", internalType: "contract Timelock" },
      ],
    },
    {
      type: "function",
      name: "totalSupply",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    },
    {
      type: "function",
      name: "transfer",
      stateMutability: "nonpayable",
      inputs: [
        { name: "to", type: "address", internalType: "address" },
        { name: "value", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
    },
    {
      type: "function",
      name: "transferFrom",
      stateMutability: "nonpayable",
      inputs: [
        { name: "from", type: "address", internalType: "address" },
        { name: "to", type: "address", internalType: "address" },
        { name: "value", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
    },
    {
      type: "function",
      name: "transferOwnership",
      stateMutability: "nonpayable",
      inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
      outputs: [],
    },
    {
      type: "function",
      name: "treasury",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
    },
    // Events
    {
      type: "event",
      name: "Approval",
      inputs: [
        {
          name: "owner",
          type: "address",
          internalType: "address",
          indexed: true,
        },
        {
          name: "spender",
          type: "address",
          internalType: "address",
          indexed: true,
        },
        {
          name: "value",
          type: "uint256",
          internalType: "uint256",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Initialized",
      inputs: [
        {
          name: "version",
          type: "uint64",
          internalType: "uint64",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "OwnershipTransferred",
      inputs: [
        {
          name: "previousOwner",
          type: "address",
          internalType: "address",
          indexed: true,
        },
        {
          name: "newOwner",
          type: "address",
          internalType: "address",
          indexed: true,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Transfer",
      inputs: [
        {
          name: "from",
          type: "address",
          internalType: "address",
          indexed: true,
        },
        { name: "to", type: "address", internalType: "address", indexed: true },
        {
          name: "value",
          type: "uint256",
          internalType: "uint256",
          indexed: false,
        },
      ],
      anonymous: false,
    },
  ],
} as const;
