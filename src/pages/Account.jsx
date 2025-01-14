import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useChain } from "../contexts/ChainContext";

export default function Account() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const { ETHBalance } = useChain();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a202c] text-[#fff]">
      <div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-wide">Account Details</h1>
          <p className="text-lg text-opacity-80">
            View your wallet details and connect to the blockchain.
          </p>
        </div>

        <main className="flex flex-col items-center gap-4 mt-8">
          {/* Account Info */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Account Information</h2>
            <div className="text-left space-y-2">
              <p>
                <span className="font-semibold">Status:</span> {account.status}
              </p>
              <p>
                <span className="font-semibold">Addresses:</span>
                {JSON.stringify(account.addresses)}
              </p>
              <p>
                <span className="font-semibold">Chain ID:</span>{" "}
                {account.chainId}
              </p>
              <p>
                <span className="font-semibold">ETH Balance:</span>
              </p>
              {ETHBalance?.formatted}
            </div>

            {account.status === "connected" && (
              <button
                onClick={() => disconnect()}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-500 transition-all mt-6"
              >
                Disconnect
              </button>
            )}
          </div>

          {/* Connect Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg mt-6">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <div className="space-y-4">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  type="button"
                  className="w-full px-6 py-3 bg-blue-600 text-white hover:bg-blue-500 font-semibold rounded-lg shadow-lg transition-all"
                >
                  {connector.name}
                </button>
              ))}
            </div>
            <div className="text-center mt-4">
              <p>Status: {status}</p>
              <p className="text-red-400">{error?.message}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
