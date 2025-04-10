import React from "react";
import StHomeCard from "../../../Components/Cards/StHomeCard";
import LandingFooter from "../../../Components/Footers/LandingFooter";
import Image from "../../../assets/Studeh.png";
import { Link } from "react-router-dom";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import { examData } from "../../../Data/morkData";
const StudentHome = () => {

  return (
    <>
      <div className="flex flex-col justify-center items-start md:px-5 gap-2 bg-white">
        <WelcomeDear/>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 grid-cols-1 w-full md:px-0 px-12 gap-12 md:pt-2 py-5 md:gap-12">
          <StHomeCard bgColor="bg-blue-900" title="Total Exams" count={examData.length} />
          <StHomeCard bgColor="bg-[#F08080]" title="Passed Exams" count={20} />
          <Link to={"/students/unpaidexams"} className="block w-full">
            <StHomeCard bgColor="bg-[#FACC2E]" title="Unpaid Exams" count={4} />
          </Link>
          <Link to={"/students/waitingexams"} className="block w-full">
            <StHomeCard bgColor="bg-blue-200" title="Waiting Exams" count={examData.length} />
          </Link>
          <StHomeCard bgColor="bg-[#86B404]" title="Passed Exams" count={20} />
          <StHomeCard bgColor="bg-[#FE9A2E]" title="Failed Exams" count={4} />
        </div>
        <img src={Image} alt="" className="w-[140px] md:ml-[400px] ml-28" />
      </div>
      <LandingFooter />
    </>
  );
};

export default StudentHome;
