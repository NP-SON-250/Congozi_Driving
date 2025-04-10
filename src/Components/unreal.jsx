import React from "react";
import Homes from "../../assets/home.jpg";
import Young from "../../assets/young.jpg";
import { FaArrowRight } from "react-icons/fa";
import { LuPhoneCall } from "react-icons/lu";
import { MdEmail } from "react-icons/md";
import { HiHome } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="grid md:grid-cols-1 justify-center items-center">
      <div className="grid md:grid-cols-2 grid-cols-1">
        {/* Image section */}
        <div className="">
          <img src={Homes} alt="" className=" " />
        </div>
        {/* Home Content */}
        <div className="flex flex-col justify-start px-5 py-2">
          <h1 className="md:text-2xl uppercase font-semibold pb-2 text-center">
            Ukeneye Gutsindira
            <span className="text-Passed">Provisoir</span> ?
          </h1>
          <div className="flex items-center w-full justify-center gap-4">
            {/* Left Line */}
            <div className="w-20 h-[2px] bg-blue-500 md:w-[30%] mt-2"></div>

            {/* Text Content */}
            <h3 className="md:text-2xl text-Unpaid font-bold">Twagufasha</h3>

            {/* Right Line */}
            <div className="w-20 h-[2px] bg-blue-500 md:w-[30%] mt-2"></div>
          </div>
          <div>
            <p className="text-start md:text-xl text-md text-blue-500 py-4 px-3">
              Uhereye uyuminsi iyandikishe kuri sisteme yacu, maze wisanzure
              n'ibisubizo bigezweho Congozi yabazaniye; Aho ushobora
              kwimenyereza gukora ibizamini bya provisoir Online, ndetse no
              kwiga ukoresheje ibizamini bisubije neza!
            </p>
          </div>
          {/* Absolute Button */}
          <Link to={'/kwiyandikisha'}>
          <div className=" md:absolute md:left-[550px] bottom-[150px] flex justify-around items-center gap-4 md:px-5 py-2 bg-blue-500 hover:bg-blue-800 rounded-full">
            <p className="text-white text-xl font-semibold p-0">Tangira Uyumunsi</p>
            <div className="w-6 rounded-full bg-white h-6 flex justify-center items-center p-2">
            <FaArrowRight className="text-blue-500"/>
            </div>
          </div>
          </Link>
        </div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1">
        {/* Image */}
        <div>
          <img src={Young} alt="" className="h-[40vh] md:w-[50%] w-full" />
        </div>
        {/* Insipirations */}
        <div className=" md:-ml-[320px] flex flex-col justify-center bg-blue-500 pb-[90px] ">
          {/* Paragraph */}
          <div className="flex flex-col">
            <p className="text-white text-start md:px-16 px-5 py-2 font-semibold">
              Ubu nawe wakoresha igihe cyawe neza! Hamwe na Congozi Expert, wakwiga amategeko
              y'umuhanda wifashishije uburyo bugezweho bwo kwimenyereza gukora ikizamini cya 
              provisoir aribwo Online wibereye iwawe.
            </p>
            <div className="w-[80%] h-[2px] bg-Passed md:w-[83%] md:ml-16 ml-5 mt-2"></div>
          </div>
          {/* Contact Information */}
          <div className="grid md:grid-cols-3 grid-cols-1 gap-1 justify-center pt-4">
            <div className="flex justify-start md:px-2 px-5 items-center text-start gap-4 ">
              <LuPhoneCall className="text-white text-2xl font-semibold"/>
              <p className="text-center text-lg text-white">+250 783 905 790 | 722 558 842</p>
            </div>
            <div className="flex justify-start md:px-0 px-5 items-center gap-4">
            <MdEmail className="text-white text-2xl font-semibold"/>
            <p className="text-center text-lg text-white underline">info@congozi.rw</p>
            </div>
            <div className="flex justify-start md:px-0 px-5 items-center gap-4">
            <HiHome className="text-white text-2xl font-semibold"/>
            <p className="text-center text-lg text-white">Nyagatare, Rwanda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
