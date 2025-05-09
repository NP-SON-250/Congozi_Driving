import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Timer = ({ initialTime, onTimeEnd, examId, examFinished }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const navigate = useNavigate();

  useEffect(() => {
    if (examFinished || !examId) return;

    const storedTime = localStorage.getItem(`examTimeLeft_${examId}`);
    const initialTimeValue = storedTime
      ? parseInt(storedTime, 10)
      : initialTime;
    setTimeLeft(initialTimeValue);
  }, [examId, initialTime, examFinished]);

  useEffect(() => {
    if (examFinished || !examId) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem(`examTimeLeft_${examId}`);
          onTimeEnd();
          return 0;
        }
        const newTime = prevTime - 1;
        localStorage.setItem(`examTimeLeft_${examId}`, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examFinished, examId, onTimeEnd]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return <div>{formatTime(timeLeft)}</div>;
};

export default Timer;
