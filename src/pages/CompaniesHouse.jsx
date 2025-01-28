import React, { useState, useEffect } from "react";
import { useChain } from "../contexts/ChainContext";
import { useNavigate } from "react-router-dom";
import { writeContract, readContract } from "@wagmi/core";
import { parseUnits } from "viem";
import { config } from "../config.ts";
import CreateCompanyForm from "../components/CreateCompanyForm.jsx";

export default function CompaniesHouse() {
  const { account, companiesHouseABI, wlfTokenABI } = useChain();
  const [companies, setCompanies] = useState([]);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFormActive, setIsFormActive] = useState(false);

  const [companyParams, setCompanyParams] = useState({
    name: "Werewolf Solutions",
    industry: "Software Development",
    domain: "https://werewolf.solutions/",
    roles: ["CEO", "CTO", "dev"],
    powerRoles: ["CEO", "CTO"],
    owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    currency: "USD",
    ownerSalary: 2000,
    ownerName: "Lorenzo",
  });

  const fetchCompanies = async () => {
    try {
      const currentCompanyIndex = await readContract(config, {
        abi: companiesHouseABI.abi,
        address: companiesHouseABI.address,
        functionName: "currentCompanyIndex",
      });
      console.log(currentCompanyIndex);

      // const result = await readContract(config, {
      //   abi: companiesHouseABI.abi,
      //   address: companiesHouseABI.address,
      //   functionName: "ownerToCompanies",
      //   args: [account.address, currentCompanyIndex],
      // });
      const result = [
        {
          companyId: 1,
          owner: account.address,
          industry: "Software Development",
          name: "Werewolf Solutions",
          createdAt: Date.now(),
          active: true,
          domain: "https://werewolf.solutions/",
          currency: "USD",
          powerRoles: ["CEO", "CTO"],
          ownerSalary: 2000,
          ownerName: "Lorenzo",
        },
      ];
      console.log(result);

      setCompanies(result);
    } catch (err) {
      setStatus(`Error fetching companies: ${err.message}`);
      console.error(err);
    }
  };

  useEffect(() => {
    if (companiesHouseABI.address != "0x") {
      fetchCompanies();
    }
  }, [account, companiesHouseABI]);

  const handleInputChange = (field) => (value) => {
    setCompanyParams((prev) => ({ ...prev, [field]: value }));
  };

  const createCompany = async () => {
    try {
      setIsProcessing(true);

      // Approve WLF token spending
      const creationFee = await readContract(config, {
        abi: companiesHouseABI.abi,
        address: companiesHouseABI.address,
        functionName: "creationFee",
      });
      console.log(creationFee);

      await writeContract(config, {
        abi: wlfTokenABI.abi,
        address: wlfTokenABI.address,
        functionName: "approve",
        args: [companiesHouseABI.address, creationFee],
      });

      console.log("Company Params:", companyParams);
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
            owner: account.address,
            currency: companyParams.currency,
            ownerSalary: parseUnits(String(companyParams.ownerSalary), 18), // Adjust for token decimals if necessary
            ownerName: companyParams.ownerName,
          },
        ],
      });

      console.log("Company created successfully!");

      setStatus("Company created successfully!");
      setCompanyParams({
        name: "",
        industry: "",
        domain: "",
        roles: [],
        powerRoles: [],
        owner: "",
        ownerSalary: 0,
        ownerName: "",
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
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg text-center mb-20 mt-20">
        <h1 className="text-4xl font-bold mb-6">Companies House</h1>

        {isFormActive && (
          <button
            className="px-4 py-2 bg-[#8e2421] text-white rounded hover:bg-[#8e25219d]"
            onClick={() => setIsFormActive(false)}
          >
            Close company creation
          </button>
        )}

        {isFormActive ? (
          <CreateCompanyForm
            createCompany={createCompany}
            handleInputChange={handleInputChange}
            companyParams={companyParams}
            isProcessing={isProcessing}
          />
        ) : (
          <button
            className="px-4 py-2 bg-[#8e2421] text-white rounded hover:bg-[#8e25219d]"
            onClick={() => setIsFormActive(true)}
          >
            Create a new company
          </button>
        )}

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
