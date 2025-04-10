import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Sidebar/Topbar";

const UsersLay = ({ role }) => {
  const location = useLocation();

  const sectionMap = {
    "/students/home": "Studend Dashboard",
    "/students/market": "Examination Market",
    "/students/online": "Do Exams Online",
    "/students/exams": "My Examinations",
    "/students/account": "My Account",
    "/students/school": "School Account",

    "/admins/home": "Admin Dashboard",
    "/admins/exams": "Exams",
    "/admins/accounts": "School Accounts Market",
    "/admins/users": "Users",
    "/admins/profile": "My Account",
    "/admins/payments": "Payments",

    "/schools/home": "School Dashboard",
    "/schools/account/market": "Account Market",
    "/schools/online": "Do Exams Online",
    "/schools/exams": "My Examinations",
    "/schools/account": "My Account",
  };

  const currentSection = sectionMap[location.pathname] || "Dashboard";

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
      </div>
    </>
  );
};

export default UsersLay;
