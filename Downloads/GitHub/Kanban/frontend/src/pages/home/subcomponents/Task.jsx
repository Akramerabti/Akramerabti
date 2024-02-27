import React, { useState, useContext } from 'react';
import TaskModal from '../../../modals/TaskModal';
import  GlobalContext  from '../context/GlobalContext';

function Task({ taskIndex, colIndex }) {
  const {appContext, setAppContext} = useContext(GlobalContext);
    const col = appContext?.currentBoard?.columns.find((col, i) => i === colIndex);
    const task = col.tasks.find((task, i) => i === taskIndex);
  

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    let completed = 0;
    let subtasks = task.subtasks || [];

    subtasks.forEach((subtask) => {
        if (subtask.status === "Done") {
            completed++;
        }
    });

    return (
        <div>
          <div
            onClick={() => {
              setIsTaskModalOpen(true);
            }}
            className=" w-[280px] first:my-5 rounded-lg  bg-white  dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer "
          >
            <p className=" font-bold tracking-wide ">{task.name}</p>
            <p className=" font-bold text-xs tracking-tighter mt-2 text-gray-500">
              {completed} of {subtasks.length} completed tasks
            </p>
          </div>
          {isTaskModalOpen && (
            <TaskModal
            colIndex ={colIndex}
            taskIndex = {taskIndex}
            />
          )}
        </div>
      );
    }


export default Task;
