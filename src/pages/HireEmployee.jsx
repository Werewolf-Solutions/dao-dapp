import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { writeContract } from "@wagmi/core";
import { useChain } from "../contexts/ChainContext";
import { parseUnits } from "viem";

export default function HireEmployee() {
  const { businessId } = useParams();
  const { companiesHouseABI } = useChain();
  const navigate = useNavigate();

  const [employeeParams, setEmployeeParams] = useState({
    address: "",
    name: "",
    role: "",
    salary: 0,
    currency: "",
  });
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field) => (e) => {
    setEmployeeParams((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const hireEmployee = async () => {
    try {
      setIsProcessing(true);

      await writeContract({
        abi: companiesHouseABI.abi,
        address: companiesHouseABI.address,
        functionName: "hireEmployee",
        args: [
          employeeParams.address,
          employeeParams.name,
          employeeParams.role,
          businessId,
          parseUnits(employeeParams.salary.toString(), 18),
          employeeParams.currency,
        ],
      });

      setStatus("Employee hired successfully!");
    } catch (err) {
      setStatus(`Error hiring employee: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a202c] text-[#fff] p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <button
          className="px-4 py-2 bg-[#8e2421] text-white rounded hover:bg-[#8e25219d]"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h1 className="text-4xl font-bold mb-6">Hire Employee</h1>

        <input
          type="text"
          placeholder="Address"
          value={employeeParams.address}
          onChange={handleInputChange("address")}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Name"
          value={employeeParams.name}
          onChange={handleInputChange("name")}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
        <button
          onClick={hireEmployee}
          className={`px-6 py-3 font-semibold rounded-lg transition-all ${
            isProcessing ? "bg-gray-600 cursor-not-allowed" : "bg-[#8e2421]"
          }`}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Hire Employee"}
        </button>

        {status && <p className="mt-4 text-red-400">{status}</p>}
      </div>
    </div>
  );
}
