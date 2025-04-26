import React from "react";

const CompanyPopup = ({ onClose }) => {
  const [companyName, setCompanyName] = React.useState("");
  const [tinNumber, setTinNumber] = React.useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
      <div className="bg-[#1e2a87] text-white rounded-2xl p-6 w-[90%] md:w-[500px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 p-2 bg-yellow-600 rounded-full w-10 h-10 text-center right-2 text-red-500 text-lg hover:shadow-2xl font-bold"
        >
          ✖
        </button>

        {/* Content */}
        <p className="text-center mb-2 capitalize">
          hemererwe kugura umuntu ufite <br /> <strong className="pr-2">Ikkigo!</strong>
          cyangwa uwabsabye hamagara:
          <span className="text-orange-400 font-semibold text-lg pl-2">
            0783905790
          </span>
        </p>

        <p className="text-center mb-4 font-bold text-md">
          shyiramo ibikurikira
        </p>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Telefone Cg Emaili Y'ikigo Cyawe"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="p-2 rounded-md text-black"
          />
          <input
            type="text"
            placeholder="Ijambo Banga Winjiriraho"
            value={tinNumber}
            onChange={(e) => setTinNumber(e.target.value)}
            className="p-2 rounded-md text-black"
          />
          <button
            onClick={() => alert("Injira clicked")}
            className="bg-orange-500  text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600"
          >
            Injira
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyPopup;
