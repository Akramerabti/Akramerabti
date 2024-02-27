import React, { useState, useContext, useEffect } from 'react'

import logo from '../../../assets/logo-mobile.svg'

import iconDown from "../../../assets/icon-chevron-down.svg";
import iconUp from "../../../assets/icon-chevron-up.svg";
import elipsis from "../../../assets/icon-vertical-ellipsis.svg";
import HeaderDropdown from './HeaderDropdown';
import AddEditBoardModal from '../../../modals/AddEditBoardModal';
import ElipsisMenu from './ElipsisMenu';
import DeleteModal from './DeleteModal'; 
import { useNavigate } from "react-router-dom";
import { axiosInstance } from '../../../utils';
import { getMonth } from "../../../utils";
import GlobalContext from "../context/GlobalContext";




function Header( {boardModalOpen, setBoardModalOpen, showCalendar, onShowCalendarToggle}) {
    
    const navigate = useNavigate(); // to navigate to different routes

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newEventTitle, setNewEventTitle] = useState('');
        
    const [openDropdown, setOpenDropdown] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const [currenMonth, setCurrentMonth] = useState(getMonth());
    const { monthIndex, showEventModal } = useContext(GlobalContext);

    const [isElipsisOpen, setElipsisOpen] = useState(false)
    const [boardType, setBoardType ] = useState('add')
    const {appContext, setAppContext} = useContext(GlobalContext);

    const handleDayClick = (date) => { 
        setSelectedDate(date);
        setIsCalendarOpen(true); // Show the calendar
    };

    const handleEventSave = () => {
        // 1. Construct the event object
        const event = {
            date: selectedDate, // Simplify for this example
            title: newEventTitle 
        };

        // 2. Send event to backend (using Axios or similar) for saving

        // 3. (Optional) Update local UI to immediately reflect new event

        // 4. Reset input, close calendar, etc.
        setNewEventTitle('');
        setIsCalendarOpen(false);
    };


    const setOpenEditModal = () => {
        setBoardModalOpen(true)
        setElipsisOpen(false)
    }

    const setOpenDeleteModal = () => {
        setIsDeleteModalOpen(true)
        setElipsisOpen(false)
    }

    const onDeleteBtnClick = (id) => {
        axiosInstance.delete(`boards/${id}/`)
        .then(function(response) {
            if (response.status >= 200 && response.status <= 299) {
              setAppContext({...appContext, currentBoard:null});
              setIsDeleteModalOpen(false)
    
            } else {
                throw Error(response.statusText);
            }
        })
        .catch((err) => {
            console.log(err);
            // setsignUpError("Signup failed. Please check your input and try again."); <------
        });
    }

    const onDropdownClick = () => {
        setOpenDropdown( state => !state)
        setElipsisOpen(false)
        setBoardType('add')
    }


    function handleLogOut() {
        axiosInstance.post('logout/')
            .then(() => {
                setIsLoggedIn(false); // Update state
                navigate('/');  // Redirect as needed
            })
            .catch((err) => {
                // Handle logout errors
            });
    }

  
    useEffect(() => {
      setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex]);
  

  return (
    <div className='p-4 fixed left-0 bg-white dark:bg-[#2b2c37] z-50 right-0'>
        <header className= ' flex justify-between dark:text-white items-center'>
            {/* Left side of header */}
            <div className=' flex items-center space-x-2 md:space-x-4'>
                <img src={logo} alt="logo"  className= 'h-6 w-6' />
                <h3 className= 'hidden md:inline-block font-bold font-sans md:text-4xl '>
                    Kanban
                </h3>
                <div className = 'flex items-center' >
                <h3 className='truncate max-w-[200px] md:text-2xl text xl 
                font-bold md:ml-20 font-sans'>
                    {appContext?.currentBoard?.name||"n/a"}
                </h3>

                    <img src={openDropdown ? iconUp : iconDown}
                    alt="dropdown icon" className='w-3 ml-2 cursor-pointer md:block' 
                    onClick={onDropdownClick}/>
                </div>
                <div><a onClick={handleLogOut} href='#'>logout</a></div>

                

            </div>

            { /*Right side of header */}

            <div className='p-4 fixed right-20 bg-white dark:bg-[#2b2c37]'>
            <button className='truncate max-w-[200px] md:text-2xl text xl 
                font-bold md:ml-20 font-sans' onClick={onShowCalendarToggle}>
                {showCalendar ? 'View Tasks' : 'Calendar'} 
            </button>
        </div>

            <img src={elipsis} onClick={() => {
                setBoardType('edit')
                setOpenDropdown(false)
                setElipsisOpen(state => !state)
            }} alt="elipsis" className='cursors-pointer-h6'/>

            {
                isElipsisOpen && <ElipsisMenu
                    setOpenDeleteModal={setOpenDeleteModal}
                    setOpenEditModal={setOpenEditModal}
                    type="Boards"/>
            }

                
        </header>

        {isCalendarOpen && (
                <div >
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
                </div>
            )}

        {openDropdown && <HeaderDropdown setBoardModalOpen=
        {setBoardModalOpen} setOpenDropdown={setOpenDropdown}/>}

        {
            boardModalOpen && <AddEditBoardModal type={boardType} setBoardModalOpen =
            {setBoardModalOpen}/>
        }

        

        {
            isDeleteModalOpen && <DeleteModal setIsDeleteModalOpen = {setIsDeleteModalOpen}
            onDeleteBtnClick={()=>onDeleteBtnClick(appContext.currentBoard.id)} title={appContext.currentBoard.name} type='board'/>
        }

        

    </div>
  );
}

export default Header;