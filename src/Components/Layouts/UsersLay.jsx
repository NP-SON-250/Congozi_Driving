import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Sidebar/Topbar";
import { useState } from "react";

const UsersLay = ({ role }) => {
  const location = useLocation();

  const sectionMap = {
    "/students/home": "Ibigigenewe Umunyeshuri",
    "/students/market": "Isoko ry'ibizamni",
    "/students/online": "Aho Bakorera Ikizamini",
    "/students/exams": "Ibizamini Byanjye",
    "/students/profile": "Umwirondoro Wanjye",
    "/students/school": "Aho Bagurira Konti Y'shuri",

    "/admins/home": "Admin Dashboard",
    "/admins/exams": "Exams",
    "/admins/accounts": "School Accounts Market",
    "/admins/users": "Users",
    "/admins/profile": "My Account",
    "/admins/payments": "Payments",

    "/schools/home": "School Dashboard",
    "/schools/account/market": "Account Market",
    "/schools/online": "Do Exams Online",
    "/schools/exams": "My Accounts",
    "/schools/account": "My Account",
  };

  const [applyHeight, setApplyHeight] = useState(false);

  // Get current year for footer
  const getCurrentYear = () => new Date().getFullYear();
  const currentSection = sectionMap[location.pathname] || "Ibigigenewe Umunyeshuri";

  return (
    <>
      <div className="flex">
        <Sidebar role={role} />
        <div className="flex flex-col">
          {/* Pass userRole to TopBar */}
          <Topbar currentSection={currentSection} role={role} />
        </div>
      </div>
      <div className="pt-20 lg:pl-[300px] md:pb-[60px] pb-[14vh]">
        <Outlet />
        {/* Footer */}
        <div className="md:fixed md:bottom-0 md:left-0 md:right-0 md:block hidden w-full">
          <div className="flex justify-center bg-Unpaid">
            <p className="md:p-[6px] p-5 text-blue-900 md:text-2xl text-xs font-bold text-center uppercase">
              &copy; {getCurrentYear()} Congozi Expert Technical Unity{" "}
              <span className="normal-case">Limited</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersLay;
