import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { writeContract } from "wagmi/actions";
import { config } from "../config.ts";
import { useChain } from "../contexts/ChainContext";

export default function FireEmployee() {
  const { companiesHouseABI } = useChain();
  const { employeeAddress, companyId } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState();

  const fireEmployee = async () => {
    await writeContract(config, {
      abi: companiesHouseABI.abi,
      address: companiesHouseABI.address,
      functionName: "fireEmployee",
      args: [employeeAddress, companyId],
    });
  };

  const fetchEmployee = async () => {
    try {
      // const result = await readContract({
      //   abi: companiesHouseABI.abi,
      //   address: companiesHouseABI.address,
      //   functionName: "retrieveEmployee",
      //   args: [companyId, employeeAddress],
      // });
      const result = {
        id: 1,
        name: "Lorenzo",
        address: employeeAddress,
        salary: 2000,
        currency: "USD",
        role: "CEO",
      };
      setEmployee(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [employeeAddress]);
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
        <p>
          Are you sure you want to fire{" "}
          <span className="font-bold">{employeeAddress}</span>?
        </p>
        <button
          className="px-4 py-2 bg-[#8e2421] text-white rounded hover:bg-[#8e25219d] mr-4"
          onClick={fireEmployee}
        >
          Yes
        </button>
        <button
          className="px-4 py-2 bg-[#8e2421] text-white rounded hover:bg-[#8e25219d]"
          onClick={() => navigate(-1)}
        >
          No
        </button>
      </div>
    </div>
  );
}
