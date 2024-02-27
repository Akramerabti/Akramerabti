import React, {useState, useContext} from 'react';
import {v4 as uuidv4} from 'uuid';
import crossIcon from "../assets/icon-cross.svg";
import GlobalContext from '../pages/home/context/GlobalContext';
import {axiosInstance} from "../utils.js";


function AddEditTaskModal({type, device, setOpenAddEditTask, taskIndex, colIndex}) {
  const {appContext, setAppContext} = useContext(GlobalContext);
  const col = appContext?.currentBoard?.columns.find((col, i) => i === colIndex);
  const task = col?.tasks?.find((task, i) => i === taskIndex);

  const [name, setName] = useState(task?.name || "");
  const [taskId, setTaskId] = useState(task?.id || -1);

  const [description, setDescription] = useState(task?.description || "");
  const [isValid, setIsValid] = useState(true);
  const [status, setStatus] = useState(task?.status || "ToDo");
  const [newColIndex, setNewColIndex] = useState(colIndex);

  const [subtasks, setSubtasks] = useState(task?.subtasks.map((subtask) => {
    return {...subtask, uuid: uuidv4()}
  }) || []);

  const onDelete = (uuid) => {
    setSubtasks((prevSubtasks) => prevSubtasks.filter((subtask) => subtask.uuid !== uuid));
  };

  const onChange = (uuid, newValue) => {
    setSubtasks((prevSubtasks) => {
      return prevSubtasks.map((subtask) => {
        if (subtask.uuid === uuid) {
          return {...subtask, name: newValue};
        }
        return subtask;
      });
    });
  };

  const onChangeStatus = (event) => {
    setStatus(event.target.value);
    setNewColIndex(event.target.selectedIndex);
  };

  const validate = () => {
    setIsValid(true);  // Set to true initially
    if (!name.trim()) {
      return false;
    }

    for (let i = 0; i < subtasks.length; i++) {
      if (!subtasks[i].name.trim()) {
        return false;
      }
    }

    return true;
  };

  const onSubmit = (type) => {
    let data = {
      name,
      description,
      subtasks,
      status,
      board: appContext.currentBoard.id,
      column: col.id,
    }
    console.log(data)
    if (type === "add") {
      axiosInstance.post(`tasks/`, data)
        .then(function (response) {
          if (response.status >= 200 && response.status <= 299) {
            //visual
            // adds the newly created tasks to the currently selected column
            setAppContext({
              ...appContext, currentBoard: {
                ...appContext.currentBoard, columns: appContext.currentBoard.columns.map((col, i) => {
                  if (i === colIndex) {
                    col.tasks = [...col.tasks, response.data]
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
    } else {
      axiosInstance.put(`tasks/${taskId}/`, data)
        .then(function (response) {
          if (response.status >= 200 && response.status <= 299) {
            //visual feedback 4 success
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
  };


  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenAddEditTask(false);
      }}
      className={
        device === 'mobile'
          ? '  py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-[-100vh] top-0 bg-[#00000080]'
          : ' py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 bottom-0 top-0 bg-[#00000080]'
      }
    >
      {/* Modal selection code */}

      <div
        className=' scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37]
            text-black dark:text-white font-bold shadow-md shadow-[#364e7ela]  max-w-md mx-auto w-full px-8 py-8 rounded-xl '
      >
        <h3 className=' text-lg'>{type === 'edit' ? 'Edit' : 'Add New'} Task</h3>

        {/* Task Name */}

        <div className=' mt-8 flex flex-col space-y-1 '>
          <label className=' text-sm dark:text-white text-gray-500'>Task Name</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className=' bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border border-gray-600 focus:outline-[#635fc7] ring-0 '
            type="text"
            placeholder='e.g Take coffee break'
          />
        </div>
        {/* Description */}

        <div className=' mt-8 flex flex-col space-y-1 '>
          <label className=' text-sm dark:text-white text-gray-500'> Description </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className=' bg-transparent px-4 py-2 outline-none focus:border-0 min-h-[200px] rounded-md text-sm border
             border-gray-600 focus:outline-[#635fc7] ring-0 '

            placeholder='Its always good to take a break, it will refresh you.'
          />
        </div>


        {/* Subtasks */}
        <div className='mt-8 flex flex-col space-y-1'>
          <label className='text-sm dark:text-white text-gray-500'>

            Subtasks

          </label>
          {subtasks.map((subtask, index) => (
            <div key={index} className='flex items-center w-full'>
              <input
                type='text'
                value={subtask.name}
                onChange={(e) => {
                  const updatedSubtasks = [...subtasks];
                  updatedSubtasks[index].name = e.target.value;
                  setSubtasks(updatedSubtasks);
                }}
                className='bg-transparent outline-none focus:border-0 border flex-grow px-4 py-2 rounded-md text-sm border-gray-600 focus:outline-[#635fc7]'
                placeholder='e.g Take a coffee break'
              />
              <img
                onClick={() => onDelete(subtask.uuid)}
                src={crossIcon}
                className='m-4 cursor-pointer'/>
            </div>
          ))}

          <button
            onClick={() => {
              setSubtasks((state) => [
                ...state,
                {name: '', isCompleted: false, uuid: uuidv4(), status: "ToDo"},

              ])

            }}
            className=' w-full items-center dark:text-[#635fc7] dark:bg-white
 text-white bg-[#635fc7] py-2 rounded-full'
          >
            + Add New Subtask

          </button>
        </div>

        {/* current status section */}
        <div className='mt-8 flex flex-col space-y-3 '>
          <label className=' text-sm dark:text-white text-gray-500'>Current status
          </label>
          <select
            value={status}
            onChange={onChangeStatus}
            className='select-status flex flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0
    border border-gray-300 focus:outline-[#635fc7]  ouline-none'>


            <option value="to-do">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>


          </select>

          <button
            onClick={() => {
              const isValid = validate()
              if (isValid) {
                onSubmit(type)
                setOpenAddEditTask(false)

              }
            }}
            className=' w-full items-center text-white bg-[#635fc7] py-2 rounded-full'
          >

            {type === 'edit' ? 'save edit' : 'Create task'}

          </button>

        </div>


      </div>
    </div>
  );
}

export default AddEditTaskModal;