const FullInput = ({ label, type = "text", placeholder, value, onChange }) => {
    return (
      <div className="flex md:flex-row flex-col gap-4 w-full px-4">
        {/* Label */}
        <label className="text-gray-700 font-medium mb-1 w-[16%]">{label}:</label>
  
        {/* Input Field */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-1 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };
  export default FullInput