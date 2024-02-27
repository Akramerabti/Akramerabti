import React, { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import crossIcon from "../assets/icon-cross.svg";
import { axiosInstance } from '../utils';
import  GlobalContext  from '../pages/home/context/GlobalContext';


function AddEditBoardModal({ setBoardModalOpen, type }) {
  const {appContext, setAppContext} = useContext(GlobalContext);
  const [name, setName] = useState(appContext?.currentBoard?.name||"");
  const [boardId, setBoardId] = useState(appContext?.currentBoard?.id||-1);

  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [isValid, setIsValid] = useState(true);
  
  const [columns, setColumns] = useState(
    appContext?.currentBoard?.columns.map((column)=>{return{...column,uuid:uuidv4()}})||[]
    );

  if (type === 'edit' && isFirstLoad) {
    setIsFirstLoad(false);
  }

  const onChange = (uuid, newValue) => {
    setColumns((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col.uuid === uuid);
      if (column) {
        column.name = newValue;
      }
      return newState;
    });
  };

  const onDelete = (uuid) => {
    setColumns((prevState) => prevState.filter((el) => el.uuid !== uuid));
  };

  const validate = () => {
    setIsValid(false);
    if (!name.trim()) {
      return false;
    }

    for (let i = 0; i < columns.length; i++) {
      if (!columns[i].name.trim()) {
        return false;
      }
    }

    setIsValid(true);
    return true;
  };

  const onSubmit = (type) => {
    let data = { name:name, columns: columns }
    console.log(data)
    setBoardModalOpen(false);
    if (type === 'add') {
      axiosInstance.post("boards/", data)
      .then(function(response) {
          if (response.status >= 200 && response.status <= 299) {
            //show visual feedback for success
            setAppContext({...appContext, currentBoard: response.data});

          } else {
              throw Error(response.statusText);
          }
      })
      .catch((err) => {
          console.log(err);
          // setsignUpError("Signup failed. Please check your input and try again."); : find a way to emit error from api->user
      });
    } else {
      axiosInstance.put(`boards/${boardId}/`, data)
      .then(function(response) {
          if (response.status >= 200 && response.status <= 299) {
            //show visual feedback for success
          } else {
              throw Error(response.statusText);
          }
      })
      .catch((err) => {
          console.log(err);
          // setsignUpError("Signup failed. Please check your input and try again."); : find a way to emit error from api->user
      });
    }
  };

  return (
    <div
      onClick={(e) => {}}
      className='fixed right-0 left-0 top-0 bottom-0 px-2 scrollbar-hide py-4 overflow-scroll z-50 justify-center items-center flex bg-[#00000080]'
    >
      {/* Modal section */}
      <div
        className='scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl'
      >
        <h3 className='text-lg'>
          {type === 'edit' ? 'Edit' : 'Add New'} Board
        </h3>

        {/* Task Name */}
        <div className='mt-8 flex flex-col space-y-3'>
          <label className='text-sm dark:text-white text-gray-500'>
            Board Columns
          </label>
          <input
            className='bg-transparent px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#635fc7] outline-1 ring-0'
            placeholder='e.g Web Design'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            id='board-name-input'
          />
        </div>

        {/* Board Columns */}
        <div className='mt-8 flex flex-col space-y-3'>
          <label className='text-sm dark:text-white text-gray-500'>
            Board Columns
          </label>

          {columns.map((column, index) => (
            <div key={index} className='flex items-center w-full'>
              <input
                className='bg-transparent flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#735fc7]'
                onChange={(e) => {
                  onChange(column.uuid, e.target.value);
                }}
                value={column.name}
                type='text'
              />
              <img
                src={crossIcon}
                className='cursor-pointer m-4'
                onClick={() => {
                  onDelete(column.uuid);
                }}
                alt='Delete Icon'
              />
            </div>
          ))}
        </div>

        <div>
          <button
            className='w-full items-center hover:opacity-75 dark:text-[#635fc7] dark:bg-white text-white bg-[#635fc7] mt-2 py-2 rounded-full'
            onClick={() => {
              setColumns((state) => [
                ...state,
                { name: '', task: [], uuid: uuidv4() },
              ]);
            }}
          >
            + Add new column
          </button>

          <button
            className='w-full items-center hover:opacity-75 darktext-white dark:bg-[#635fc7] mt-8 relative text-white bg-[#635fc7] py-2 rounded-full'
            onClick={() => {
              const isValid = validate();
              if (isValid) onSubmit(type);
            }}
          >
            {type === 'add' ? 'Create new board' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditBoardModal;