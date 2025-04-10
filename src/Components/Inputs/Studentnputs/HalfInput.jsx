import React from "react";

const  HalfInput = ({ label, type, placeholder, value, onChange }) => {
  return (
    <div className="flex md:flex-row flex-col gap-3 w-full md:pl-4 px-4">
      {/* Label */}
      <label className="text-gray-700 font-medium w-[30%]">{label}:</label>

      {/* Input Field */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="md:w-[66%]  w-full px-1 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
export default HalfInput
