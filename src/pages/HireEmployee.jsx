import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { writeContract } from "@wagmi/core";
import { useChain } from "../contexts/ChainContext";
import { parseUnits } from "viem";

import { config } from "../config.ts";

export default function HireEmployee() {
  const { companyId } = useParams();
  const { companiesHouseABI, account } = useChain();
  const navigate = useNavigate();

  const [employeeParams, setEmployeeParams] = useState({
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    name: "Gino",
    role: "Dev",
    salary: 1000,
    currency: "",
  });
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [company, setCompany] = useState();

  const handleInputChange = (field) => (e) => {
    setEmployeeParams((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const hireEmployee = async () => {
    try {
      setIsProcessing(true);

      console.log(employeeParams);
      console.log(company);

      await writeContract(config, {
        abi: companiesHouseABI.abi,
        address: companiesHouseABI.address,
        functionName: "hireEmployee",
        args: [
          {
            employeeAddress: employeeParams.address,
            name: employeeParams.name,
            role: employeeParams.role,
            companyId,
            salary: parseUnits(employeeParams.salary.toString(), 18),
            currency: company.currency,
          },
        ],
      });

      setStatus("Employee hired successfully!");
    } catch (err) {
      setStatus(`Error hiring employee: ${err.message}`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchCompany = async () => {
    try {
      // const result = await readContract(config, {
      //   abi: companiesHouseABI.abi,
      //   address: companiesHouseABI.address,
      //   functionName: "ownerToCompanies",
      //   args: [account.address, 1],
      // });
      const result = {
        companyId: 1,
        owner: account.address,
        industry: "Industry",
        name: "Name",
        createdAt: Date.now(),
        active: true,
        domain: "domain.com",
        currency: "USD",
        roles: ["CEO", "CTO", "dev", "collaborator"],
      };

      setCompany(result);
    } catch (err) {
      setStatus(`Error fetching companies: ${err.message}`);
      console.error(err);
    }
  };

  useEffect(() => {
    if (companiesHouseABI.address != "0x") {
      fetchCompany();
    }
  }, [companiesHouseABI]);

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
        <input
          type="text"
          placeholder="Role"
          value={employeeParams.role}
          onChange={handleInputChange("role")}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Salary"
          value={employeeParams.salary}
          onChange={handleInputChange("salary")}
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
