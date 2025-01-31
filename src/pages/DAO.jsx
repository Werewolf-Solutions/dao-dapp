import React, { useState, useEffect } from "react";
import { useChain } from "../contexts/ChainContext";
import {
  writeContract,
  readContract,
  watchContractEvent,
  getBlock,
  getTransaction,
} from "@wagmi/core";
import { encodeAbiParameters, parseUnits } from "viem";
import { config } from "../config.ts";
import { client } from "../config.ts";

async function simulateBlocks(num) {
  // Ensure num is a valid number of blocks to simulate
  if (num <= 0) {
    throw new Error("Number of blocks to simulate must be greater than 0.");
  }
  await client.request({
    method: "anvil_increaseTime",
    params: [num],
  });

  await client.request({
    method: "anvil_mine",
    params: [],
  });
}

export default function DAO() {
  const {
    account,
    daoABI,
    daoAddress,
    tokenSaleABI,
    wlfTokenABI,
    getTreasuryBalance,
    getProposalCost,
    proposalCost,
    fetchProposals,
    proposals,
    convertToReadableInput,
    wlfDecimals,
  } = useChain();

  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility
  const [newProposalTitle, setNewProposalTitle] = useState(""); // New proposal input
  const [targets, setTargets] = useState(""); // Targets input
  const [signatures, setSignatures] = useState(""); // Signatures input
  const [datas, setDatas] = useState(""); // Data input

  const [guardian, setGuardian] = useState("");
  const [block, setBlock] = useState({});

  const testInputs = () => {
    setNewProposalTitle("Proposal to start a token sale");

    // Define the sale token amount and price
    // amount = 100,000,000 WLF
    // price = $0.01
    const saleTokenAmount = parseUnits("1000000000", 18);
    const saleTokenPrice = parseUnits("0.01", 18);

    // Transfer WLF to token sale contract
    const transferProposalCallData = encodeAbiParameters(
      [
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      [tokenSaleABI.address, saleTokenAmount]
    );

    // Start sale
    const saleProposalCallData = encodeAbiParameters(
      [
        { name: "_amount", type: "uint256" },
        { name: "_price", type: "uint256" },
      ],
      [saleTokenAmount, saleTokenPrice]
    );

    // Set proposal data
    setTargets(`${wlfTokenABI.address}, ${tokenSaleABI.address}`);
    setSignatures("airdrop(address,uint256), startSale(uint256,uint256)");
    setDatas(`${transferProposalCallData}`, `${saleProposalCallData}`);
  };

  const handleCreateProposal = async () => {
    if (!newProposalTitle.trim() || !targets || !signatures || !datas) return;

    // const targetArray = targets.split(",").map((t) => t.trim());
    // const signatureArray = signatures.split(",").map((s) => s.trim());
    // const dataArray = datas.split(",").map((d) => d.trim());

    // console.log(targetArray);
    // console.log(signatureArray);
    // console.log(dataArray);

    try {
      const unwatch = watchContractEvent(config, {
        abi: daoABI.abi,
        eventName: "ProposalCreated",
        onLogs(logs) {
          console.log("Logs changed!", logs);
        },
      });

      // Approve WLF token spending
      await writeContract(config, {
        abi: wlfTokenABI.abi,
        address: wlfTokenABI.address,
        functionName: "approve",
        args: [daoABI.address, proposalCost],
      });

      const mintAmount = parseUnits("10", 18); // 10 WLF

      // Mint call data
      const mintProposalCallData = encodeAbiParameters(
        [{ name: "amount", type: "uint256" }],
        [mintAmount]
      );
      await writeContract(config, {
        abi: daoABI.abi,
        address: daoABI.address,
        functionName: "createProposal",
        args: [
          [wlfTokenABI.address],
          ["mint(uint256 amount)"],
          [mintProposalCallData],
        ], // [targetArray, signatureArray, dataArray],
      });

      await getTreasuryBalance();
      await fetchProposals();

      setNewProposalTitle("");
      setTargets("");
      setSignatures("");
      setDatas("");
      setIsPopupOpen(false);

      unwatch();
    } catch (error) {
      console.error("Error creating proposal:", error);
    }
  };

  const getGuardian = async () => {
    if (daoABI.address != "0x") {
      const _guardian = await readContract(config, {
        abi: daoABI.abi,
        address: daoABI.address,
        functionName: "guardian",
      });
      setGuardian(_guardian);
    }
  };

  useEffect(() => {
    getGuardian();
  }, []);

  async function getBlockNumber() {
    const blockNumber = await getBlock(config);
    console.log(blockNumber);

    setBlock(blockNumber);
  }

  useEffect(() => {
    getBlockNumber();
  }, []);

  const handleVote = async (id, support) => {
    try {
      const unwatch = watchContractEvent(config, {
        abi: daoABI.abi,
        eventName: "Voted",
        onLogs(logs) {
          console.log("Logs changed!", logs);
        },
      });
      await writeContract(config, {
        abi: daoABI.abi,
        address: daoABI.address,
        functionName: "vote",
        args: [id, support],
      });

      await fetchProposals();

      unwatch();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a202c] text-[#fff] p-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6">DAO Proposals</h1>

        <span>
          Block: {new Date(Number(block.timestamp) * 1000).toLocaleString()}
        </span>

        <button
          onClick={() => {
            testInputs();
            setIsPopupOpen(true);
          }}
          className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d] font-semibold rounded-lg shadow-lg transition-all mb-6"
        >
          Create Proposal for{" "}
          {convertToReadableInput(proposalCost, wlfDecimals)} WLF
        </button>

        <div className="flex flex-wrap gap-4 w-full items-center justify-center max-w-4xl">
          {proposals.length > 0 ? (
            proposals.map((proposal) => {
              const totalVotes = proposal.votesFor + proposal.votesAgainst;
              const forPercent =
                totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
              const againstPercent =
                totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;

              return (
                <div
                  key={proposal.id}
                  className="p-4 bg-gray-800 rounded-lg shadow-lg space-y-2"
                >
                  <h3 className="text-xl font-bold">{proposal.title}</h3>
                  {guardian === account.address && (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d] font-semibold rounded-lg shadow-lg transition-all"
                        onClick={async () => {
                          const blockNumber = await getBlock(config);

                          const seconds =
                            proposal.endTime - blockNumber.timestamp; // go to end of voting period

                          console.log(blockNumber.timestamp);
                          console.log(proposal.endTime);
                          console.log(proposal.endTime - blockNumber.timestamp);

                          await simulateBlocks(seconds);
                          const blockNumberAfter = await getBlock(config);

                          console.log(blockNumberAfter.number);
                          console.log(
                            new Date(
                              Number(blockNumberAfter.timestamp) * 1000
                            ).toLocaleString()
                          );
                          setBlock(blockNumberAfter);
                        }}
                      >
                        Simulate voting period
                      </button>
                      <button
                        className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d] font-semibold rounded-lg shadow-lg transition-all"
                        onClick={async () => {
                          try {
                            const unwatch = watchContractEvent(config, {
                              abi: daoABI.abi,
                              eventName: "ProposalQueued",
                              onLogs(logs) {
                                console.log("Logs changed!", logs);
                              },
                            });
                            // const delay = await readContract(config, {
                            //   abi: timelockABI.abi,
                            //   address: timelockABI.address,
                            //   functionName: "delay",
                            //   args: [proposal.id],
                            // });
                            // console.log(delay);
                            const tx = await writeContract(config, {
                              abi: daoABI.abi,
                              address: daoABI.address,
                              functionName: "queueProposal",
                              args: [proposal.id],
                            });
                            const transaction = await getTransaction(config, {
                              hash: tx,
                            });
                            console.log(transaction);

                            await fetchProposals();

                            unwatch();
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      >
                        Queue
                      </button>
                      <button
                        className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d] font-semibold rounded-lg shadow-lg transition-all"
                        onClick={async () => {
                          const proposalState = await readContract(config, {
                            abi: daoABI.abi,
                            address: daoABI.address,
                            functionName: "getProposalState",
                            args: [proposal.id],
                          });
                          console.log(proposalState);

                          const targets = await readContract(config, {
                            abi: daoABI.abi,
                            address: daoABI.address,
                            functionName: "getTargets",
                            args: [proposal.id],
                          });
                          console.log(targets);
                        }}
                      >
                        Get state
                      </button>
                      <button
                        className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d] font-semibold rounded-lg shadow-lg transition-all"
                        onClick={async () => {
                          await writeContract(config, {
                            abi: daoABI.abi,
                            address: daoABI.address,
                            functionName: "executeProposal",
                            args: [proposal.id],
                          });
                          await fetchProposals();

                          await getTreasuryBalance();
                        }}
                      >
                        Execute
                      </button>
                      <button
                        className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d] font-semibold rounded-lg shadow-lg transition-all"
                        onClick={async () => {
                          await writeContract(config, {
                            abi: daoABI.abi,
                            address: daoABI.address,
                            functionName: "approveProposal",
                            args: [proposal.id],
                          });
                          await fetchProposals();
                        }}
                      >
                        Approve
                      </button>
                    </div>
                  )}
                  <p>
                    <span className="font-normal">State:</span>{" "}
                    <span className="font-extrabold">{proposal.state}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Proposer:</span>{" "}
                    {proposal.proposer}
                  </p>
                  <p>
                    <span className="font-semibold">Start Time:</span>{" "}
                    {new Date(
                      Number(proposal.startTime) * 1000
                    ).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">End Time:</span>{" "}
                    {new Date(Number(proposal.endTime) * 1000).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">ETA:</span> {proposal.eta}
                  </p>
                  <div className="space-y-1">
                    <p>
                      Votes For:{" "}
                      <span className="font-semibold">{proposal.votesFor}</span>{" "}
                      ({forPercent.toFixed(1)}%)
                    </p>
                    <p>
                      Votes Against:{" "}
                      <span className="font-semibold">
                        {proposal.votesAgainst}
                      </span>{" "}
                      ({againstPercent.toFixed(1)}%)
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleVote(proposal.id, true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all"
                    >
                      Vote For
                    </button>
                    <button
                      onClick={() => handleVote(proposal.id, false)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all"
                    >
                      Vote Against
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-lg text-gray-400">
              No proposals created yet.
            </p>
          )}
        </div>

        {/* Popup for Proposal Creation */}
        {isPopupOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setIsPopupOpen(false)}
          >
            <div
              className="bg-gray-800 p-6 rounded-lg shadow-lg text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Create Proposal</h2>
              <input
                type="text"
                placeholder="Proposal title"
                value={newProposalTitle}
                onChange={(e) => setNewProposalTitle(e.target.value)}
                className="w-full p-3 rounded-lg text-black mb-4 outline-none"
              />
              <textarea
                placeholder="Targets (comma-separated)"
                value={targets}
                onChange={(e) => setTargets(e.target.value)}
                className="w-full p-3 rounded-lg text-black mb-4 outline-none"
              />
              <textarea
                placeholder="Signatures (comma-separated)"
                value={signatures}
                onChange={(e) => setSignatures(e.target.value)}
                className="w-full p-3 rounded-lg text-black mb-4 outline-none"
              />
              <textarea
                placeholder="Datas (comma-separated)"
                value={datas}
                onChange={(e) => setDatas(e.target.value)}
                className="w-full p-3 rounded-lg text-black mb-4 outline-none"
              />
              <button
                onClick={handleCreateProposal}
                className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d] font-semibold rounded-lg shadow-lg transition-all"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
