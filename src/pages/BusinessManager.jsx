import React, { useState } from "react";
import { useChain } from "../contexts/ChainContext";
import { writeContract, readContract } from "@wagmi/core";
import { parseUnits } from "viem";
import { config } from "../config.ts";

export default function BusinessManager() {
  const { account, companiesHouseABI } = useChain();

  const [companyParams, setCompanyParams] = useState({
    name: "Test",
    industry: "Test",
    domain: "test.com",
    roles: [],
    powerRoles: [],
    ownerName: "",
    ownerSalary: 0,
    ownerCurrency: "",
  });

  const [employeeParams, setEmployeeParams] = useState({
    employeeAddress: "",
    name: "",
    role: "",
    companyId: 0,
    salary: 0,
    currency: "",
  });

  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (setter, field) => (e) => {
    setter((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const createCompany = async () => {
    try {
      setIsProcessing(true);

      await writeContract(config, {
        abi: companiesHouseABI.abi,
        address: companiesHouseABI.address,
        functionName: "createCompany",
        args: [
          companyParams.name,
          companyParams.industry,
          companyParams.domain,
          companyParams.roles,
          companyParams.powerRoles,
          companyParams.ownerName,
          parseUnits(companyParams.ownerSalary.toString(), 18),
          companyParams.ownerCurrency,
        ],
      });

      setStatus("Company created successfully!");
    } catch (err) {
      setStatus(`Error creating company: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const hireEmployee = async () => {
    try {
      setIsProcessing(true);

      await writeContract(config, {
        abi: companiesHouseABI.abi,
        address: companiesHouseABI.address,
        functionName: "hireEmployee",
        args: [
          employeeParams.employeeAddress,
          employeeParams.name,
          employeeParams.role,
          employeeParams.companyId,
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
        <h1 className="text-4xl font-bold mb-6">Business Manager</h1>

        <div className="space-y-4 text-left">
          <h2 className="text-2xl font-bold">Create a Company</h2>
          <input
            type="text"
            placeholder="Company Name"
            value={companyParams.name}
            onChange={handleInputChange(setCompanyParams, "name")}
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Industry"
            value={companyParams.industry}
            onChange={handleInputChange(setCompanyParams, "industry")}
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Domain"
            value={companyParams.domain}
            onChange={handleInputChange(setCompanyParams, "domain")}
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={createCompany}
            className={`px-6 py-3 font-semibold rounded-lg transition-all ${
              isProcessing
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[#8e2421] text-white hover:bg-[#8e25219d]"
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Create Company"}
          </button>
        </div>

        <div className="space-y-4 text-left mt-6">
          <h2 className="text-2xl font-bold">Hire an Employee</h2>
          <input
            type="text"
            placeholder="Employee Address"
            value={employeeParams.employeeAddress}
            onChange={handleInputChange(setEmployeeParams, "employeeAddress")}
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Employee Name"
            value={employeeParams.name}
            onChange={handleInputChange(setEmployeeParams, "name")}
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={hireEmployee}
            className={`px-6 py-3 font-semibold rounded-lg transition-all ${
              isProcessing
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[#8e2421] text-white hover:bg-[#8e25219d]"
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Hire Employee"}
          </button>
        </div>

        {status && <p className="mt-4 text-sm text-red-400">{status}</p>}
      </div>
    </div>
  );
}
