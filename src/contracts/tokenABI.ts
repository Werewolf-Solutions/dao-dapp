export const tokenABI = {
  address: "0x69d9846400888EE1F282A3312e59f79C050Aa2A6",
  abi: [
    {
      type: "function",
      name: "balanceOf",
      stateMutability: "view",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ type: "uint256" }],
    },
    {
      type: "function",
      name: "totalSupply",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "supply", type: "uint256" }],
    },
  ],
} as const;
