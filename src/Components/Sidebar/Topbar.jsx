import React, { useState } from "react";
import { AiOutlineNotification } from "react-icons/ai";
import { PiFolderOpenDuotone } from "react-icons/pi";
import { IoLanguageOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import Police from "../../assets/Policelogo.png";

const Topbar = ({ currentSection, role = "students" }) => {
  const [menuVisible, setMenuVisible] = useState(false); // State to track menu visibility

  const studentTop = [
    {
      id: 1,
      name: "Notification",
      path: "/students/notifications",
      icon: <AiOutlineNotification size={24} />,
    },
    {
      id: 2,
      name: "Logout",
      path: "/students/signout",
      icon: <PiFolderOpenDuotone size={24} />,
    },
    {
      id: 3,
      name: "Language",
      path: "#",
      icon: <IoLanguageOutline size={24} />,
    },
  ];

  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // Toggle the menu visibility
  };

  return (
    <div
      className={`fixed top-0 right-0 md:px-24 px-4 flex justify-between items-center w-full h-[11vh] shadow bg-Total`}
      style={{ zIndex: 999 }}
    >
      {/* Logo and Role */}
      <div className="flex justify-center items-center gap-5">
        <Link to={`/${role}/home`}>
          <img src={Police} alt="Logo" className="h-12 text-center" />
        </Link>
        <div className="text-lg font-bold text-white">{currentSection}</div>
      </div>
      {/* Menu Items */}
      <div className="flex justify-between items-center">
        <div className="hidden md:block">
          <ul className="flex items-center gap-6 text-gray-600 border border-Waiting rounded-md">
            {studentTop.map((item) => {
              return (
                <li key={item.id}>
                  <a
                    href={item.path}
                    className="flex gap-2 py-1 px-3 hover:text-Unpaid/95 text-white font-semibold"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        {/* Large device User Profile  */}
      
        {/* Mobile User Profile */}
        <div
          className="flex justify-center items-center gap-2 cursor-pointer md:hidden"
          onClick={toggleMenu} // Toggle menu on click
        >
          <div className="bg-white text-blue-500 p-2 rounded-full flex justify-center items-center">
            <FaUser />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuVisible && (
        <div className="absolute top-[11vh] right-0 w-full bg-gray-800 py-4 md:hidden z-[999]">
          <div className="block py-1">
      <div className="flex justify-center items-center gap-2">
        <div className="bg-white text-blue-500 p-2 rounded-full flex justify-center items-center">
          <FaUser size={60}/>
        </div>
        <div className=" text-lg font-bold text-white">UMURERWA</div>
      </div>
      </div>
          <ul className="flex flex-col items-start gap-4 text-white">
            {studentTop.map((item) => (
              <li key={item.id}>
                <a
                  href={item.path}
                  className="flex gap-2 py-2 px-4 hover:text-Unpaid/95 font-semibold"
                >
                  {item.icon}
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="md:block hidden">
      <div className="flex justify-center items-center gap-2">
        <div className="bg-white text-blue-500 p-2 rounded-full flex justify-center items-center">
          <FaUser/>
        </div>
        <div className=" md:block hidden text-lg font-bold text-white">UMURERWA</div>
      </div>
      </div>
    </div>
  );
};

export default Topbar;
