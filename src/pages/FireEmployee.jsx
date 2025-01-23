import React from "react";
import { useNavigate } from "react-router-dom";

export default function FireEmployee() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a202c] text-[#fff] p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <button
          className="px-4 py-2 bg-[#8e2421] text-white rounded hover:bg-[#8e25219d]"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h1 className="text-4xl font-bold mb-6">Fire Employee</h1>
      </div>
    </div>
  );
}
