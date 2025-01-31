export const dao_ABI = {
  address: "0x",
  abi: [
    {
      type: "function",
      name: "__acceptAdmin",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "approveProposal",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "authorizeCaller",
      inputs: [{ name: "_caller", type: "address", internalType: "address" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "authorizedCallers",
      inputs: [{ name: "", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "createProposal",
      inputs: [
        { name: "_targets", type: "address[]", internalType: "address[]" },
        { name: "_signatures", type: "string[]", internalType: "string[]" },
        { name: "_datas", type: "bytes[]", internalType: "bytes[]" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "deauthorizeCaller",
      inputs: [{ name: "_caller", type: "address", internalType: "address" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "delegate",
      inputs: [{ name: "delegatee", type: "address", internalType: "address" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "executeProposal",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "guardian",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "initialize",
      inputs: [
        { name: "_token", type: "address", internalType: "address" },
        { name: "_treasury", type: "address", internalType: "address" },
        { name: "_timelock", type: "address", internalType: "address" },
        { name: "_gaurdian", type: "address", internalType: "address" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "latestProposalIds",
      inputs: [{ name: "", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "proposalCost",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "proposalCount",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "proposalMaxOperations",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "proposalReceipts",
      inputs: [
        { name: "", type: "uint256", internalType: "uint256" },
        { name: "", type: "address", internalType: "address" },
      ],
      outputs: [
        { name: "hasVoted", type: "bool", internalType: "bool" },
        { name: "support", type: "bool", internalType: "bool" },
        { name: "votes", type: "uint96", internalType: "uint96" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "proposalThreshold",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "getProposalState",
      inputs: [
        {
          name: "_proposalId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "status",
          type: "string",
          internalType: "string",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "proposals",
      inputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "proposalState",
          type: "uint8",
          internalType: "enum DAO.ProposalState",
        },
        {
          name: "id",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "proposer",
          type: "address",
          internalType: "address",
        },
        {
          name: "votesFor",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "votesAgainst",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "startTime",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "endTime",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "eta",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "canceled",
          type: "bool",
          internalType: "bool",
        },
        {
          name: "executed",
          type: "bool",
          internalType: "bool",
        },
      ],
      stateMutability: "view",
    },
    // TODO: remove after testing
    {
      type: "function",
      name: "getTargets",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "targets", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "queueProposal",
      inputs: [
        { name: "_proposalId", type: "uint256", internalType: "uint256" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "queuedTransactions",
      inputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "quorumVotes",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "timelock",
      inputs: [],
      outputs: [
        { name: "", type: "address", internalType: "contract Timelock" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "treasury",
      inputs: [],
      outputs: [
        { name: "", type: "address", internalType: "contract Treasury" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "treasuryAddress",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "undelegate",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "updateMerkleRoot",
      inputs: [{ name: "_root", type: "bytes32", internalType: "bytes32" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "vote",
      inputs: [
        {
          name: "_proposalId",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "_support",
          type: "bool",
          internalType: "bool",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "voted",
      inputs: [
        { name: "", type: "address", internalType: "address" },
        { name: "", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "votingPeriod",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "werewolfToken",
      inputs: [],
      outputs: [
        { name: "", type: "address", internalType: "contract WerewolfTokenV1" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "werewolfTokenAddress",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
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
      name: "ProposalCreated",
      inputs: [
        {
          name: "proposalId",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "proposer",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ProposalExecuted",
      inputs: [
        {
          name: "proposalId",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ProposalQueued",
      inputs: [
        {
          name: "id",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "eta",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Voted",
      inputs: [
        {
          name: "proposalId",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "voter",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        { name: "support", type: "bool", indexed: false, internalType: "bool" },
        {
          name: "votes",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
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
  ],
} as const;
