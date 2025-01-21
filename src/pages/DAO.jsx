import React, { useState } from "react";
import { useChain } from "../contexts/ChainContext";
import { writeContract } from "@wagmi/core";
import { config } from "../config.ts";

export default function DAO() {
  const { account, daoABI, daoAddress } = useChain();

  const [proposals, setProposals] = useState([]); // List of proposals
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility
  const [newProposal, setNewProposal] = useState(""); // New proposal input
  const [targets, setTargets] = useState(""); // Targets input
  const [signatures, setSignatures] = useState(""); // Signatures input
  const [datas, setDatas] = useState(""); // Data input

  const handleCreateProposal = async () => {
    if (!newProposal.trim() || !targets || !signatures || !datas) return;

    const targetArray = targets.split(",").map((t) => t.trim());
    const signatureArray = signatures.split(",").map((s) => s.trim());
    const dataArray = datas.split(",").map((d) => d.trim());

    try {
      await writeContract(config, {
        abi: daoABI.abi,
        address: daoABI.address,
        functionName: "createProposal",
        args: [targetArray, signatureArray, dataArray],
      });

      const newProposalId = proposals.length + 1; // Mocking a proposal ID
      const proposal = {
        id: newProposalId,
        title: newProposal,
        votesFor: 0,
        votesAgainst: 0,
      };

      setProposals((prev) => [...prev, proposal]);
      setNewProposal("");
      setTargets("");
      setSignatures("");
      setDatas("");
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error creating proposal:", error);
    }
  };

  const handleVote = async (id, support) => {
    try {
      const proof = []; // Placeholder for proof (adjust based on your contract's requirements)
      const voteAmount = 1; // Mocked vote amount, adjust based on your app logic

      await writeContract({
        abi: daoABI,
        address: daoAddress,
        functionName: "vote",
        args: [id, voteAmount, support, proof],
      });

      setProposals((prev) =>
        prev.map((proposal) =>
          proposal.id === id
            ? {
                ...proposal,
                votesFor: support ? proposal.votesFor + 1 : proposal.votesFor,
                votesAgainst: !support
                  ? proposal.votesAgainst + 1
                  : proposal.votesAgainst,
              }
            : proposal
        )
      );
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a202c] text-[#fff] p-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6">DAO Proposals</h1>

        <button
          onClick={() => setIsPopupOpen(true)}
          className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d] font-semibold rounded-lg shadow-lg transition-all mb-6"
        >
          Create Proposal
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
                  <div className="flex gap-4">
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
                value={newProposal}
                onChange={(e) => setNewProposal(e.target.value)}
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
