import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdMoreHoriz } from "react-icons/md";
import { HiHome } from "react-icons/hi2";
import { BsCart } from "react-icons/bs";
import { PiFolderSimpleUserLight } from "react-icons/pi";
import { IoIosMenu } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { PiExam } from "react-icons/pi";
import { MdManageAccounts } from "react-icons/md";
import { MdAccountBalance } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { FaGoogleScholar } from "react-icons/fa6";

const Sidebar = ({ role = "students", onSignOut }) => {
  const location = useLocation();
  const [showAll, setShowAll] = useState(false);

  const handleNavClick = (path) => {
    window.location.href = path; // hard reload to reset system
  };

  const sidebarMenu = {
    students: [
      {
        name: "Home",
        path: "/students/home",
        iconR: <HiHome size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "Examination Market",
        path: "/students/market",
        iconR: <BsCart size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "Do Exams Online",
        path: "/students/tracking",
        iconR: <PiFolderSimpleUserLight size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "My Examinations",
        path: "/students/exams",
        iconR: <IoIosMenu size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "My Account",
        path: "/students/account",
        iconR: <IoSettingsOutline size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "School Account Market",
        path: "/students/school",
        iconR: <FaGoogleScholar size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
    ],
    schools: [
      {
        name: "Home",
        path: "/schools/home",
        iconR: <HiHome size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "Account Market",
        path: "/schools/account/market",
        iconR: <BsCart size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "Do Exams Online",
        path: "/schools/online",
        iconR: <PiFolderSimpleUserLight size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "My Examinations",
        path: "/schools/exams",
        iconR: <IoIosMenu size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "My Account",
        path: "/schools/account",
        iconR: <IoSettingsOutline size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
    ],
    admins: [
      {
        name: "Dashboard",
        path: "/admins/home",
        iconR: <MdDashboard size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "Exams",
        path: "/admins/exams",
        iconR: <PiExam size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "Accounts",
        path: "/admins/accounts",
        iconR: <MdAccountBalance size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "Users",
        path: "/admins/users",
        iconR: <FaUsers size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "Payments",
        path: "/admins/payments",
        iconR: <FcSalesPerformance size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
      {
        name: "My Account",
        path: "/admins/profile",
        iconR: <MdManageAccounts size={24} />,
        iconL: <IoIosArrowForward size={24} />,
      },
    ],
  };

  const items = sidebarMenu[role] || [];
  const visibleItems = items.slice(0, 2);
  const hiddenItems = items.slice(2);

  return (
    <div className="container relative">
      {/* Desktop Sidebar */}
      <div className="w-[300px] h-[78vh] px-4 py-4 overflow-y-auto shadow fixed bottom-[75px] left-0 md:block hidden z-[50]">
        <ul>
          {items.map((item, index) => (
            <li key={index} className="py-[10px]">
              <button
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center w-full text-left px-3 py-1 rounded-full text-lg font-medium ${
                  location.pathname === item.path
                    ? " border border-Passed font-bold md:text-xl"
                    : "text-black"
                }`}
              >
                <span className="mr-3 text-blue-500">{item.iconR}</span>
                {item.name}
                <div className="absolute right-6 text-blue-500">
                  {item.iconL}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-400 py-3 px-1 md:hidden z-[999]">
        <ul className="flex justify-around items-center">
          {visibleItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleNavClick(item.path)}
                className={`flex flex-col items-center text-lg p-0 rounded-2xl font-medium ${
                  location.pathname === item.path
                    ? "text-lg text-blue-500"
                    : "text-gray-700"
                }`}
              >
                <span
                  className={`mr-3 ${
                    location.pathname === item.path
                      ? "text-tblue bg-gray-400 border border-tblue px-3 py-3 rounded-full"
                      : "text-gray-700 bg-white border border-gray-700 px-3 py-3 rounded-full"
                  }`}
                >
                  {item.iconR}
                </span>
                <span
                  className={`mr-3 ${
                    location.pathname === item.path
                      ? "text-tblue font-bold "
                      : "text-gray-700 "
                  }`}
                >
                  {item.name}
                </span>
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex flex-col items-center text-xl font-medium text-gray-700 pr-4 px-3 py-3 pt-5 rounded-full"
            >
              <div className="icon">
                <MdMoreHoriz size={40} />
              </div>
              <span>More</span>
            </button>
          </li>
        </ul>

        {/* More Items Dropdown */}
        {showAll && (
          <ul className="fixed bottom-[110px] left-0 w-full bg-gray-100 py-3 px-1 grid grid-cols-2 gap-4 border-t border-gray">
            {hiddenItems.map((item, index) => (
              <li key={index} className="flex justify-center">
                <button
                  onClick={() => {
                    setShowAll(false);
                    handleNavClick(item.path);
                  }}
                  className="flex flex-col items-center text-sm font-medium"
                >
                  <span
                    className={`mr-3 ${
                      location.pathname === item.path
                        ? "text-tblue bg-gray-400 text-blue-500 px-3 py-3 rounded-full"
                        : "border bg-white border-gray-700 text-gray-700 px-3 py-3 rounded-full"
                    }`}
                  >
                    {item.iconR}
                  </span>
                  <span
                    className={`mt-1 text-lg ${
                      location.pathname === item.path
                        ? "text-lg text-blue-500"
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
