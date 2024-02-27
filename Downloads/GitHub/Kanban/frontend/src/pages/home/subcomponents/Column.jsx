// import React, { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { shuffle } from 'lodash';

// function Column({ colIndex }) {
//   const colors = [
//     'bg-red-500',
//     'bg-orange-500',
//     'bg-blue-500',
//     'bg-purple-500',
//     'bg-green-500',
//     'bg-indigo-500',
//     'bg-yellow-500',
//     'bg-pink-500',
//     'bg-sky-500',
//   ];

//   const [color, setColor] = useState(null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     setColor(shuffle(colors).pop()); // shuffle colours
//   }, [dispatch]);

//   return (
//     <div className='scrollbar-hide mx-5 pt-[990px] min-w-[280px]'>
//       <div className={`font-semibold flex items-center gap-2 tracking-widest md:tracking-[.2em] text-[#828fa3]`}>
//         <div className={`rounded-full w-4 h-4 ${color}`} />
//       </div>
//     </div>
//   );
// }

// export default Column;


import {shuffle} from "lodash";
import React, {useEffect, useState, useContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import Task from "./Task";
import GlobalContext from '../context/GlobalContext';
import AddEditTaskModal from '../../../modals/AddEditTaskModal';
import elipsis from "../../../assets/icon-vertical-ellipsis.svg";
import ElipsisMenu from "./ElipsisMenu.jsx";


function Column({colIndex}) {
    const {appContext, setAppContext} = useContext(GlobalContext);
    const [openAddEditTask, setOpenAddEditTask] = useState(false)


    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-blue-500",
        "bg-purple-500",
        "bg-green-500",
        "bg-indigo-500",
        "bg-yellow-500",
        "bg-pink-500",
        "bg-sky-500",
    ];

    const dispatch = useDispatch();
    const [color, setColor] = useState(null)
    const col = appContext?.currentBoard?.columns.find((col, i) => i === colIndex);
    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [dispatch]);

    return (
        <div className='scrollbar-hide mx-5 pt-[90px] w-screen'>
            <div className={`font-semibold flex items-center gap-2 mt-3 text: text-xl tracking-widest md:tracking-[.2em] text-[#828fa3]`}>
                <div className={`rounded-full w-4 h-4 ${color}`}/>
                {col?.name} ({col?.tasks.length || 0})

                {/** this is the add task button */}
                <div className='flex  space-x-4 items-center  md:space-x-6'>
                    <button
                        onClick={
                            () => {
                                setOpenAddEditTask(state => !state)
                            }
                        }
                        className=' p-3 ml-2 items-start hidden md:block button text-2xl '>
                        + Add New Task
                    </button>

                    <button
                        onClick={
                            () => {
                                setOpenAddEditTask(state => !state)
                            }
                        }
                        className='button py-1 px-3 md:hidden'>
                        +
                    </button>

                </div>

                {
                    col && openAddEditTask &&
                    <AddEditTaskModal setOpenAddEditTask={setOpenAddEditTask}
                                      device='mobile' type='add'
                                      colIndex={colIndex}/>
                }

            </div>
            {
                col?.tasks.map((task, index) => (
                    <Task key={index} taskIndex={index} colIndex={colIndex}/>

                ))
            }


        </div>
    );
}

export default Column;
