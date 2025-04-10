import React, { useState, useEffect } from "react";

const WelcomeDear = () => {
  const [currentDate, setCurrentDate] = useState("");

  const getCurrentDateAndTime = () => {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const isPM = hours >= 12;

    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const period = isPM ? "PM" : "AM";

    return `${day}-${month}-${year} ${hours}:${formattedMinutes} ${period}`;
  };

  useEffect(() => {
    setCurrentDate(getCurrentDateAndTime());
    const interval = setInterval(() => {
      setCurrentDate(getCurrentDateAndTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex justify-between text-white w-full items-center bg-blue-900 md:px-2 md:py-0 py-3 rounded-sm">
      <p className="flex justify-center md:text-xl text-xs gap-2 p-1">
        Welcome, <span className="md:text-xl text-xs">UMURERWA Anaise</span>
      </p>
      <h1 className="md:text-base text-xs">{currentDate}</h1>
    </div>
  );
};

export default WelcomeDear;
