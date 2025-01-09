import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a202c] text-[#fff]">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-wide">
          Welcome to Token Sale & DAO Tester
        </h1>
        <p className="text-lg text-opacity-80">
          Explore and test token sales, interact with DAO contracts, and join
          our community.
        </p>
      </div>

      <main className="flex flex-col items-center gap-4 mt-8">
        <Link
          to="/token-sale"
          className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d]  font-semibold rounded-lg shadow-lg transition-all"
        >
          Token Sale
        </Link>
        <Link
          to="/dao"
          className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d] font-semibold rounded-lg shadow-lg transition-all"
        >
          DAO Contracts
        </Link>
      </main>
    </div>
  );
}
