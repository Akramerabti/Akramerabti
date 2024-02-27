import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
export default function CreateEventButton() {
  const { setShowEventModal } = useContext(GlobalContext);
  return (
    <button
      onClick={() => setShowEventModal(true)}
      className="border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl"
    >
      <span className=" justify-between ml-7 mr-7 pl-5 pr-5 items-center"> Create</span>
    </button>
  );
}