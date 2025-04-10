import React from "react";
import { FaUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { IoIosLogIn } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";
import LoginInputs from "../../Components/Inputs/Studentnputs/LoginInputs";
import Injira from "../../assets/Injira.png";
const Login = () => {
  return (
    <div className=" pt-24 md:px-12">
      <div className=" grid md:grid-cols-2 grid-cols-1 rounded-r-md rounded-b-none md:border border-blue-700">
        <div className="flex justify-end  md:h-[60vh] ">
          <img src={Injira} alt="" />
        </div>
        <div className="flex flex-col items-center gap-3 md:py-0 py-6 md:border-l border-blue-700">
          <div className="flex justify-center items-center gap-2 w-full bg-blue-700 md:rounded-l-none rounded-md py-3">
            <IoIosLogIn className="md:text-2xl text-3xl text-white" />
            <p className="text-white text-xl font-semibold">
              Kwinjira muri konti
            </p>
          </div>
          <p className=" text-lg md:px-20 p-2">
            Kugirango ubone amakuru yawe n'ibizamini ndetse na serivisi zitangwa
            na Congozi. Ugomba kubanza kwinjira
          </p>
          <div className="flex flex-col items-start gap-4 md:w-[70%] w-full ">
            <LoginInputs
              label="Nomero Yawe Ya Telefone"
              type="text"
              icon={<FaUser />}
              placeholder="07XXXXXXXX"
            />
            <LoginInputs
              label="Ijambo banga ukoresha"
              type="password"
              icon={<CiLock />}
              placeholder="Shyiramo ijambobanga"
            />
          </div>
          <button className="flex justify-center items-center text-2xl md:w-[50%] py-2 w-[90%] py-1x px-6 md:gap-5 gap-10 bg-Unpaid rounded-md hover:bg-yellow-600">
            <FaCircleArrowRight className="text-blue-800 text-xl" />
            Saba Kwinjira
          </button>
          <div className="md:flex-row flex-col flex justify-center items-center md:gap-10 gap-4">
            <Link to={"/hindura"}>
              <p className="flex justify-center items-center gap-2 text-blue-500 text-md">
                <FaQuestionCircle /> Wibagiwe Ijambobanga?
              </p>
            </Link>
            <p className="flex justify-center items-center gap-2 text-blue-500 text-md">
              Nta konti ufite?
              <Link
                to={"/kwiyandikisha"}
                className="text-xl text-blue-800 font-semibold"
              >
                Yifungure
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
