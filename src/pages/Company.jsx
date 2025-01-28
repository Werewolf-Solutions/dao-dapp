import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useChain } from "../contexts/ChainContext";
import { readContract } from "@wagmi/core";

export default function Company() {
  const { companyId } = useParams();
  const { account, companiesHouseABI } = useChain();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [status, setStatus] = useState("");
  const [company, setCompany] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newRole, setNewRole] = useState("");

  const payEmployees = async () => {
    console.log("Pay employees");
  };

  const fetchEmployees = async () => {
    try {
      // const result = await readContract({
      //   abi: companiesHouseABI.abi,
      //   address: companiesHouseABI.address,
      //   functionName: "getEmployeesByCompany",
      //   args: [companyId],
      // });
      const result = [
        {
          id: 1,
          name: "Lorenzo",
          address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          salary: 2000,
          currency: "USD",
          role: "CEO",
        },
        {
          id: 2,
          name: "Marq",
          address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
          salary: 2000,
          currency: "USD",
          role: "CTO",
        },
      ];
      setEmployees(result);
    } catch (err) {
      setStatus(`Error fetching employees: ${err.message}`);
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

  const handleRoleChange = async (employeeId, newRole) => {
    console.log(`Updating role for employee ${employeeId} to ${newRole}`);
    // Add logic to call smart contract to update employee role
  };

  useEffect(() => {
    fetchCompany();
    fetchEmployees();
  }, [companyId, companiesHouseABI]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#1a202c] text-[#fff] p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <button
          className="px-4 py-2 bg-[#8e2421] text-white rounded hover:bg-[#8e25219d]"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h1 className="text-4xl font-bold mb-6">Business: {company?.name}</h1>

        <h2 className="text-2xl font-bold mb-4">Employees</h2>
        <button
          className="mb-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={payEmployees}
        >
          Pay Employees
        </button>
        {status && <p className="text-sm text-red-400">{status}</p>}
        <ul className="space-y-4">
          {employees.map((employee) => (
            <li
              key={employee.id}
              className="bg-gray-700 p-4 rounded flex flex-col items-start space-y-2"
            >
              <div className="flex justify-between w-full items-center">
                <span>
                  {employee.name} - {employee.role}
                </span>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-[#8e2421] text-white rounded hover:bg-[#8e25219d]"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    Manage Role
                  </button>
                  <a
                    href={`/companies/${companyId}/fire-employee/${employee.address}`}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  >
                    Fire
                  </a>
                </div>
              </div>
              {selectedEmployee?.id === employee.id && (
                <div className="mt-2 w-full">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    {company.roles.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      handleRoleChange(employee.id, newRole);
                      setSelectedEmployee(null);
                      setNewRole("");
                    }}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Update Role
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <Link
          to={`/companies/${companyId}/hire-employee`}
          className="block mt-6 px-4 py-2 bg-[#8e2421] text-white rounded hover:bg-[#8e25219d]"
        >
          Hire Employee
        </Link>
      </div>
    </div>
  );
}
