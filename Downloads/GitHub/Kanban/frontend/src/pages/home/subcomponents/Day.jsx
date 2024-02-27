import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
    viewMode, // Include viewMode from context
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) =>
        dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  useEffect(() => {
    console.log("Current viewMode:", viewMode); // Log the current value of viewMode
  }, [viewMode]);


  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }

  

  return (
    <div className="border border-gray-200 flex flex-col">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1">
            {viewMode === "weekly" ? day.format("ddd").toUpperCase() : ""}
          </p>
        )}
        <p
          className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}
        >
          {day.format("DD")}
        </p>
      </header>
      <div className="flex-1 cursor-pointer"  
      onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}>
{viewMode === "weekly" ? ( // Render different content for weekly view
  <div className="flex flex-col h-full">
    {Array.from({ length: 7 }, (_, dayIndex) => ( // Iterate for 7 days
      <div key={dayIndex} className="flex flex-col h-full"> 
        {Array.from({ length: 24 }, (_, hourIndex) => (
          <div key={hourIndex} className="flex-1 border-y border-gray-200">
            {/* Display time slots */}
            <div className="p-1 text-xs">{`${hourIndex}:00`}</div>
            {/* Display events for each time slot */}
            <div className="flex flex-col">
              {dayEvents
                .filter((evt) => {
                  const evtDay = dayjs(evt.day);
                  const currentDay = dayjs().startOf('week').add(dayIndex, 'days');
                  return evtDay.isSame(currentDay, 'day'); // Check if event is on the same day
                })
                .map((evt, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedEvent(evt)}
                    className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-xs rounded mb-1 truncate`}
                  >
                    {evt.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>

        ) : (
          // Render daily view content
          <>
              {dayEvents.map((evt, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedEvent(evt)}
                className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
              >
                <div className="flex justify-between">
                  <div>{evt.title}</div>
                  <div className="text-xs text-gray-400 ">
                    {evt.startTime}-{evt.endTime}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}