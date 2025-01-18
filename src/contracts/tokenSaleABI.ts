export const tokenSaleABI = {
  address: "0xD8a5a9b31c3C0232E196d518E89Fd8bF83AcAd43",
  abi: [
    {
      type: "function",
      name: "buyTokens",
      inputs: [
        { name: "_amount", type: "uint256", internalType: "uint256" },
        { name: "token0", type: "address", internalType: "address" },
        { name: "token1", type: "address", internalType: "address" },
        { name: "fee", type: "uint24", internalType: "uint24" },
        { name: "tickLower", type: "int24", internalType: "int24" },
        { name: "tickUpper", type: "int24", internalType: "int24" },
        { name: "amount0Desired", type: "uint256", internalType: "uint256" },
        { name: "amount1Desired", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "endSale",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "initialize",
      inputs: [
        { name: "newOwner", type: "address", internalType: "address" },
        { name: "_token", type: "address", internalType: "address" },
        { name: "_treasury", type: "address", internalType: "address" },
        { name: "_timelock", type: "address", internalType: "address" },
        { name: "_usdtTokenAddress", type: "address", internalType: "address" },
        { name: "_stakingAddress", type: "address", internalType: "address" },
        { name: "_uniswapHelper", type: "address", internalType: "address" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "liquidityExamplesContract",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract ILiquidityExamples",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "owner",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "price",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "renounceOwnership",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "saleActive",
      inputs: [],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "saleIdCounter",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "sales",
      inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      outputs: [
        { name: "saleId", type: "uint256", internalType: "uint256" },
        { name: "tokensAvailable", type: "uint256", internalType: "uint256" },
        { name: "price", type: "uint256", internalType: "uint256" },
        { name: "active", type: "bool", internalType: "bool" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "setUsdtTokenAddress",
      inputs: [
        { name: "_usdtTokenAddress", type: "address", internalType: "address" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "stakingContract",
      inputs: [],
      outputs: [
        { name: "", type: "address", internalType: "contract Staking" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "startSale",
      inputs: [
        { name: "_amount", type: "uint256", internalType: "uint256" },
        { name: "_price", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "startSaleZero",
      inputs: [
        { name: "_amount", type: "uint256", internalType: "uint256" },
        { name: "_price", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "transferOwnership",
      inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "uniswapHelper",
      inputs: [],
      outputs: [
        { name: "", type: "address", internalType: "contract IUniswapHelper" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "usdtToken",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "usdtTokenAddress",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    // Events
    {
      type: "event",
      name: "Initialized",
      inputs: [
        {
          name: "version",
          type: "uint64",
          indexed: false,
          internalType: "uint64",
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
          indexed: true,
          internalType: "address",
        },
        {
          name: "newOwner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "SaleEnded",
      inputs: [
        {
          name: "saleId",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "SaleStarted",
      inputs: [
        {
          name: "saleId",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "tokensAvailable",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "price",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "TokensPurchased",
      inputs: [
        {
          name: "buyer",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "amount",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "saleId",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    // Errors
    {
      type: "error",
      name: "InvalidInitialization",
      inputs: [],
    },
    {
      type: "error",
      name: "NotInitializing",
      inputs: [],
    },
    {
      type: "error",
      name: "OwnableInvalidOwner",
      inputs: [{ name: "owner", type: "address", internalType: "address" }],
    },
    {
      type: "error",
      name: "OwnableUnauthorizedAccount",
      inputs: [{ name: "account", type: "address", internalType: "address" }],
    },
  ],
} as const;
