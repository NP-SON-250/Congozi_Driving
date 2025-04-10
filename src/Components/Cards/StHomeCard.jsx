import React from "react";
import { CiFolderOn } from "react-icons/ci";

const StHomeCard = ({ bgColor, title, count }) => {
  return (
    <div
      className={`flex w-full max-w-[280px] justify-between items-start pr-3 pl-2 gap-12 ${bgColor} rounded-md hover:opacity-70 cursor-pointer shadow-2xl`}
    >
      <CiFolderOn className="text-white" size={70} />
      <div className="flex flex-col justify-center items-end">
        <h2 className="text-white md:text-xl text-lg">{title}</h2>
        <p className="text-white md:text-5xl text-3xl">{count}</p>
      </div>
    </div>
  );
};

export default StHomeCard;
