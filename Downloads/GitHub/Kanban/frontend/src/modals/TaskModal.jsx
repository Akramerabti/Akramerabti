import React, {useState, useContext} from 'react';
import ElipsisMenu from '../pages/home/subcomponents/ElipsisMenu'; // Adjust the path as needed
import ellipsis from "../assets/icon-vertical-ellipsis.svg";
import Subtask from '../pages/home/subcomponents/Subtask';
import GlobalContext from '../pages/home/context/GlobalContext';
import AddEditTaskModal from "./AddEditTaskModal.jsx";
import {axiosInstance} from "../utils.js";


function TaskModal({colIndex, taskIndex}) {
  const {appContext, setAppContext} = useContext(GlobalContext);
  const col = appContext?.currentBoard?.columns.find((col, i) => i === colIndex);
  const task = col.tasks.find((task, i) => i === taskIndex);
  const subtasks = task.subtasks;

  const [elipsisMenuOpen, setElipsisMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [openAddEditTask, setOpenAddEditTask] = useState(false)


  const setOpenEditModal = () => {
    setElipsisMenuOpen(false)
    setOpenAddEditTask(true)

  }
  const setOpenDeleteModal = () => {
    setIsDeleteModalOpen(true)
    setOpenAddEditTask(false)
    setElipsisMenuOpen(false)
  }

  const onChange = (e) => {
    let newStatus = e.target.value
    let data = {status: newStatus}
    axiosInstance.patch(`tasks/${task.id}/`, data)
      .then(function (response) {
        if (response.status >= 200 && response.status <= 299) {
          //visual
          setStatus(newStatus)
          setAppContext({
            ...appContext, currentBoard: {
              ...appContext.currentBoard, columns: appContext.currentBoard.columns.map((col, i) => {
                if (i === colIndex) {
                  return {
                    ...col, tasks: col.tasks.map((task, j) => {
                      if (j === taskIndex) {
                        return {...task, ...response.data}
                      }

                      return task
                    })
                  }

                }
                return col;
              })
            }
          });
        } else {
          throw Error(response.statusText);
        }
      })
      .catch((err) => {
        console.log(err);
        // setsignUpError("Signup failed. Please check your input and try again."); <------
      });
  }

  let completed = 0;
  subtasks.forEach(subtask => {
    if (subtask.status === "Done") {
      completed++;
    }
  });

  const [status, setStatus] = useState(task.status);
  return (
    <div
      className='fixed right-0 left-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 bottom-0 justify-center items-center flex bg-[#000000080]'
    >
      {/* modal section */}
      <div
        className='scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-old shadow-md max-w-md mx-auto w-full px-8 py-8 rounded-xl'
      >
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-lg font-bold'>{task.name}</h1>
          <img
            alt='Close'
            src={ellipsis} // Replace with the actual path to your close icon image
            onClick={() => setElipsisMenuOpen(state => !state)}
            className='cursor-pointer h-6'
          />
        </div>

        {elipsisMenuOpen && <ElipsisMenu
          setOpenEditModal={setOpenEditModal}
          setOpenDeleteModal={setOpenDeleteModal}
          type='Task'/>}

        <p
          className='text-gray 500 font-semibold tracking-wide text-sm pt-6'
        >
          {task.description}

        </p>

        <p
          className=' pt-6 text-gray-500 tracking-widest text-sm'
        >
          Subtasks({completed} of {subtasks.length})
        </p>

        {/*Subtasks Section*/}
        <div
          className=' mt3-3 space-y-2 '
        >
          {
            subtasks.map((subtask, i) => {
              return (
                <Subtask
                  index={i}
                  taskIndex={taskIndex}
                  colIndex={colIndex}
                  key={i}
                />
              )
            })
          }
        </div>

        {/*Current Status Section*/}

        <div
          className=' mt-8 flex flex-col space-y-3'

        >
          <label
            className=' text-sm dark:text-white text-gray-500 '>

            Current Status


          </label>
          <select
            className=' select-status flex-grow-0 px-4 py-2 rounded-md text-sm bg-transparent focus:border-0
            border border-gray-300 focus:outline-[#635fc7] outline-none '
            value={status}
            onChange={onChange}
          >
            <option className=' status-option' value="ToDo">To Do</option>
            <option className=' status-option' value="Done">Done</option>
          </select>

        </div>


        {/* Your modal content here */}

        {
          col && openAddEditTask && <AddEditTaskModal setOpenAddEditTask={setOpenAddEditTask}
                                                      device='mobile' type='edit'
                                                      colIndex={colIndex} taskIndex={taskIndex}/>
        }

      </div>

    </div>
  );
}

export default TaskModal;