import React from "react";

export default function CreateCompanyForm({
  createCompany,
  handleInputChange,
  companyParams,
  isProcessing,
}) {
  return (
    <div className="space-y-4 text-left">
      <h2 className="text-2xl font-bold">Create a Company</h2>
      <input
        type="text"
        placeholder="Company Name"
        value={companyParams.name}
        onChange={handleInputChange("name")}
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Industry"
        value={companyParams.industry}
        onChange={handleInputChange("industry")}
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Domain"
        value={companyParams.domain}
        onChange={handleInputChange("domain")}
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
      />
      <textarea
        placeholder="Roles (comma-separated)"
        value={companyParams.roles.join(", ")}
        onChange={(e) => handleInputChange("roles")(e.target.value.split(", "))}
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
      ></textarea>
      <textarea
        placeholder="Power Roles (comma-separated)"
        value={companyParams.powerRoles.join(", ")}
        onChange={(e) =>
          handleInputChange("powerRoles")(e.target.value.split(", "))
        }
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
      ></textarea>
      <input
        type="text"
        placeholder="Owner Name"
        value={companyParams.owner}
        onChange={handleInputChange("owner")}
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Owner Currency"
        value={companyParams.currency}
        onChange={handleInputChange("currency")}
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
  );
}
