import React, {useContext, useState} from 'react'
import  GlobalContext  from '../context/GlobalContext';

function Subtask({index, taskIndex, colIndex}) {
  const {appContext, setAppContext} = useContext(GlobalContext);
  const col = appContext?.currentBoard?.columns.find((column, i) => colIndex === i);
  const task = col.tasks.find((col, i) => taskIndex === i);
  const subtask = task.subtasks.find((subtask, i) => i === index);
  const [checked, setChecked] = useState(subtask.status === 'Done')

  const onChange = () => {
    let data = {status: checked? "ToDo": "Done"}
    axiosInstance.patch(`tasks/${subtask.id}/`, data)
      .then(function (response) {
        if (response.status >= 200 && response.status <= 299) {
          //visual
          setAppContext({
            ...appContext, currentBoard: {
              ...appContext.currentBoard, columns: appContext.currentBoard.columns.map((col, i) => {
                if (i === colIndex) {
                  return {
                    ...col, tasks: col.tasks.map((task, j) => {
                      if (j === taskIndex) {
                        return {
                          ...task, subtasks: task.subtasks.map((subtask, k) => {
                            if (k === index) {
                              setChecked(response.data.status === 'Done')
                              return {...subtask, ...response.data}
                            }
                            return subtask
                          })
                        }
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

  return (
    <div
      className=' w-full flex hover:bg-[#635fc740] dark:hover:bg-[#635fc740]
    rounded-md relative items-center justify-start dark:bg-[#20212c] p-3 gap-4 bg-[#f4f7fd]'
    >
      <input type='checkbox' className=' w-4 h-4 accent-[#635fc7] cursor-pointer '
             checked={checked}
             onChange={onChange}

      />
      <p
        className={checked ? ' line-through opacity-30': ''}
      >
        {subtask.name}

      </p>
    </div>
  )
}

export default Subtask