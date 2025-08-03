import React from "react";

const AddCompanyUserPopup = ({
  CompanyName,
  Tin,
  Phone,
  Email,
  Address,
  Idcard,
  Password,
  setCompanyName,
  setTin,
  setPhone,
  setEmail,
  setAddress,
  setIdcard,
  setPassword,
  setShowAddPopup,
  handleAddUser,
  isLoading,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-center">
          Add  Company (Role: School)
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Company Name"
            value={CompanyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="TIN"
            value={Tin}
            onChange={(e) => setTin(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Phone"
            value={Phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
          />
          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Address"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="ID Card"
            value={Idcard}
            onChange={(e) => setIdcard(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() => setShowAddPopup(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAddUser}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isLoading ? "Adding..." : "Add Company"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyUserPopup;
