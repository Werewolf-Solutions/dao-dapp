import React from "react";
import { Link } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#1a202c] text-[#fff]">
      <Header />

      {/* Main Content */}
      <main className="flex flex-col justify-center items-center flex-grow text-center space-y-6 px-4">
        <h1 className="text-5xl font-bold text-red-500">404</h1>
        <p className="text-xl text-opacity-80">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-[#8e2421] text-white hover:bg-[#8e25219d] font-semibold rounded-lg shadow-lg transition-all"
        >
          Go Back Home
        </Link>
      </main>

      <Footer />
    </div>
  );
}
