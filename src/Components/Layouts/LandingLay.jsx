import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const LandingLay = () => {
  const [applyHeight, setApplyHeight] = useState(false);

  // Get current year for footer
  const getCurrentYear = () => new Date().getFullYear();

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    const checkScreenSize = () => {
      const isMdUp = window.matchMedia("(min-width: 768px)").matches;
      setApplyHeight(isMdUp);
    };

    setVh();
    checkScreenSize();

    window.addEventListener("resize", setVh);
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="md:max-h-[10vh]">
        <Navbar />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-grow`}
        style={
          applyHeight
            ? { height: "calc(var(--vh, 1vh) * 100 - 10vh)" }
            : undefined
        }
      >
        <div className="flex-grow">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="md:fixed md:bottom-0 md:left-0 md:right-0 w-full">
          <div className="flex justify-center bg-Unpaid">
            <p className="p-4 text-blue-900 md:text-2xl text-sm font-bold text-center uppercase">
              &copy; {getCurrentYear()} Congozi Expert Technical Unity{" "}
              <span className="normal-case">Limited</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingLay;
