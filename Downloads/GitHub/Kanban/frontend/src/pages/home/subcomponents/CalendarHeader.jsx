import dayjs from "dayjs";
import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex, viewMode, setViewMode } = useContext(GlobalContext);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
    console.log("Previous Month Button Clicked!", monthIndex); // Log the current monthIndex
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
    console.log("Next Month Button Clicked!", monthIndex); // Log the current monthIndex
  }

  function handleReset() {
    console.log("Reset Button Clicked!", monthIndex); // Log the current monthIndex
    console.log("Reset Button Clicked!", dayjs().month()); // Log the current monthIndex
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    );
  }

  function toggleView() {
    setViewMode(prevMode => prevMode === "monthly" ? "weekly" : "monthly");
  }

  return (
    <header className={"px-4 py-2 flex z-50 justify-between mt-20"}>
      <div className="flex items-center">
      <h1 className="mr-10 text-xl text-gray-500 fond-bold">Calendar</h1>
      <button onClick={handleReset} className="border rounded py-2 px-4 mr-5">
        Today
      </button>
      <button onClick={handlePrevMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          &#x00AB; 
        </span>
      </button>
      <h2 className="ml-4 text-xl text-gray-500 font-bold">
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </h2>
      <button onClick={handleNextMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          &#x00BB; 
        </span>
      </button>
      </div>
      <button className="border rounded py-2 px-5 justify-between right-20" onClick={toggleView}>
        {viewMode === "weekly" ? "Monthly" : "Weekly"}
      </button>
    </header>
  );
}