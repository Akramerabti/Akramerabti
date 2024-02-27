import Header from './subcomponents/Header';
import Center from './subcomponents/Center';
import { useDispatch, useSelector } from 'react-redux';
import boardsSlice from '../../redux/boardsSlice';
import EmptyBoard from './subcomponents/EmptyBoard';
import React, { useState, useContext, useEffect } from "react";
import "../../index.css";
import { getMonth } from "../../utils";
import CalendarHeader from "./subcomponents/CalendarHeader";
import Sidebar from "./subcomponents/CalendarSide";
import Month from "./subcomponents/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./subcomponents/EventModal";

function Home() {
  const dispatch = useDispatch()
  const boards = useSelector((state) => state.boards)
  const activeBoard = boards.find(board => board.isActive)

  if(!activeBoard && boards.length > 0){
    dispatch(boardsSlice.actions.setBoardActive({index : 0}))
  }
  
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false); // State to control calendar view
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);


  return (
      <div className='overflow-hidden overflow-x-scroll'>
          {boards.length > 0 ? (
              <>
                  <Header 
                      boardModalOpen={boardModalOpen} 
                      setBoardModalOpen={setBoardModalOpen}
                      showCalendar={showCalendar} // Pass state
                      onShowCalendarToggle={() => setShowCalendar(!showCalendar)} // Event handler
                  />

                  {/* Conditional center section display */}
                  {showCalendar ? (
                       <React.Fragment>
                       {showEventModal && <EventModal />}
                 
                       <div className="h-screen flex flex-col">
                         <CalendarHeader />
                         <div className="flex flex-1">
                           <Sidebar />
                           <Month month={currenMonth} />
                         </div>
                       </div>
                     </React.Fragment>
                  ) : (
                      <Center 
                          boardModalOpen={boardModalOpen} 
                          setBoardModalOpen={setBoardModalOpen}
                      />
                  )}
              </>
          ) : (
              <EmptyBoard type='add' />
          )}
      </div>
  );
}

export default Home;
