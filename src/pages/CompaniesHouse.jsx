import React, { useState, useEffect } from "react";
import { useChain } from "../contexts/ChainContext";
import { useNavigate } from "react-router-dom";
import { writeContract, readContract } from "@wagmi/core";
import { parseUnits } from "viem";
import { config } from "../config.ts";
import CreateCompanyForm from "../components/CreateCompanyForm.jsx";

export default function CompaniesHouse() {
  const { account, companiesHouseABI } = useChain();
  const [companies, setCompanies] = useState([]);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [companyParams, setCompanyParams] = useState({
    name: "test",
    industry: "test",
    domain: "test.com",
    roles: ["CEO", "CTO", "dev"],
    powerRoles: ["CEO", "CTO"],
    owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    currency: "USD",
  });

  const fetchCompanies = async () => {
    try {
      // const result = await readContract(config, {
      //   abi: companiesHouseABI.abi,
      //   address: companiesHouseABI.address,
      //   functionName: "ownerToCompanies",
      //   args: [account.address, 1],
      // });
      const result = [
        {
          companyId: 1,
          owner: account.address,
          industry: "Industry",
          name: "Name",
          createdAt: Date.now(),
          active: true,
          domain: "domain.com",
          currency: "USD",
          roles: ["CEO", "CTO"],
        },
      ];
      setCompanies(result);
    } catch (err) {
      setStatus(`Error fetching companies: ${err.message}`);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [account, companiesHouseABI]);

  const handleInputChange = (field) => (e) => {
    setCompanyParams((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const createCompany = async () => {
    try {
      setIsProcessing(true);

      await writeContract(config, {
        abi: companiesHouseABI.abi,
        address: companiesHouseABI.address,
        functionName: "createCompany",
        args: [
          {
            name: companyParams.name,
            industry: companyParams.industry,
            domain: companyParams.domain,
            roles: companyParams.roles,
            powerRoles: companyParams.powerRoles,
            owner: companyParams.owner,
            currency: companyParams.currency,
          },
        ],
      });

      setStatus("Company created successfully!");
      setCompanyParams({
        name: "",
        industry: "",
        domain: "",
        roles: [],
        powerRoles: [],
        owner: "",
        currency: "",
      });
      await fetchCompanies();
    } catch (err) {
      setStatus(`Error creating company: ${err.message}`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a202c] text-[#fff] p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6">Companies House</h1>

        <CreateCompanyForm
          createCompany={createCompany}
          handleInputChange={handleInputChange}
          companyParams={companyParams}
          isProcessing={isProcessing}
        />

        <h2 className="text-2xl font-bold mb-4 mt-6">Your Companies</h2>
        {status && <p className="text-sm text-red-400">{status}</p>}
        <ul className="space-y-4">
          {companies.map((company) => (
            <li
              key={company.companyId}
              className="bg-gray-700 p-4 rounded flex justify-between items-center"
            >
              <span>{company.name}</span>
              <a
                href={`/companies/${company.companyId}`}
                className="px-4 py-2 bg-[#8e2421] text-white rounded hover:bg-[#8e25219d]"
              >
                Manage
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
