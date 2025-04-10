import React from "react";
import Police from "../../assets/Policelogo.png";
import HalfInput from "../../Components/Inputs/Studentnputs/HalfInput";
import FullInput from "../../Components/Inputs/Studentnputs/FullInput";
import { ImUserPlus } from "react-icons/im";
const Register = () => {
  return (
    <div className=" pt-20">
      <div className="bg-black/20 flex justify-center items-center p-1 rounded-sm">
        <h1 className="text-xl text-Total font-semibold font-Roboto">
          Fungura konti kuri Congozi
        </h1>
      </div>
      <div className="flex md:flex-row flex-col">
        {/* Logo Section */}
        <div className="flex justify-center items-center bg-Total md:h-[80vh] md:w-[45%]">
          <img src={Police} alt="" className="h-[200px]" />
        </div>

        {/* Form Section */}
        <div className="border border-b-blue-500 border-r-blue-500 rounded-t-md w-full">
          {/* Form Header */}
          <div className="bg-Passed flex justify-center items-center gap-3 py-2 rounded-r-md">
            <div className="bg-white px-2 rounded-full">
              <p className="text-2xl text-Passed">+</p>
            </div>
            <h4 className="text-white text-xl font-semibold">Kwiyandikisha</h4>
          </div>

          {/* Form Fields */}
          <form className="w-full pb-5 flex flex-col gap-4">
            <div className="flex md:flex-row flex-col gap-1 pt-4">
              <HalfInput label="Izina rya mbere" type="text" />
              <HalfInput label="Izina rya kabiri" type="text" />
            </div>
            <FullInput label="Indangamuntu" type="text" />
            <FullInput label="Telefone" type="text" />
            <FullInput label="Email" type="email" />
            <div className="flex md:flex-row flex-col gap-1">
              <HalfInput label="Intara" type="text" />
              <HalfInput label="Akarere" type="text" />
            </div>
            <div className="flex md:flex-row flex-col gap-1">
              <HalfInput label="Ijambobanga" type="password" />
              <HalfInput label="Risubiremo" type="password" />
            </div>

            <div className="flex md:flex-row flex-col justify-center items-center md:mr-[150px] pt-6 md:gap-20 gap-6">
              {/* Terms & Conditions Checkbox */}
              <div className="flex items-center gap-2 px-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-5 h-5 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-gray-700 font-medium cursor-pointer"
                >
                  Nemera amabwiriza n'amategeko
                </label>
              </div>
              <div className=" flex justify-center items-center gap-2 px-4 py-1 rounded-md bg-blue-500 hover:bg-blue-700">
                <ImUserPlus className="text-white" />
                <button className=" text-white">Emeza Kwiyandikisha</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
