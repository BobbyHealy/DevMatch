import { useAuth } from "@/context/AuthContext";
import ScrumTask from "./ScrumTask";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import ScrumData from '../mockup_data/scrum-data.json'
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { switchProjPage } from "@/fireStoreBE/User";
//import updateSingleTask from "@/pages/api/updateSingleTask";


function createGuidId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function Scrumboard({pid}) {
  const [ready, setReady] = useState(false);
  const [boardData, setBoardData] = useState(ScrumData);
  const [showForm, setShowForm] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(0);
  const[tasks,setTasks] =useState();
  const [tasksObj, setTasksObj] = useState([]);
  
  const{user}= useAuth();
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      pid: pid,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch("http://localhost:3000/api/getTasks", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setTasks(JSON.parse(result)[0])
    })
      .catch((err) => {
        console.log(err);
      });
    
}, []);
useEffect(() => {

  var tObj = []
  tasks?.forEach((task)=>{

    tObj.push(JSON.parse(task))
    if (tObj.length ===tasks.length)
    {
      setTasksObj(tObj)
    }
  })
  
}, [tasks]);
useEffect(() => {

  if(tasksObj){
    var bItems = []
    var pItems = []
    var cItems = []
    tasksObj.forEach((task)=>{console.log(task.progress)
      if(task.progress === 0)
      {
        bItems.push(task)
      }else if (task.progress === 1)
      {
        pItems.push(task)
      }else
      {
        cItems.push(task)
      }
    })
    if(bItems.length+pItems.length+cItems.length=== tasks?.length)
    {
      const data =[
        {
            "name":"Backlog Tasks",
            "items": bItems
        },
        {
            "name":"In Progress",
            "items": pItems
        },
        {
            "name":"Completed",
            "items": cItems
        }
    ]
    setBoardData(data)

      
    }

  }

  
}, [tasksObj]);

const addTask= (e) =>{
  if(pid)
  {
      //const val = e.target.value;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      // var raw = JSON.stringify({
      //   pid: pid,
      //   "task":  "{"+
      //     "progress:'"+ e.progress+"',"+
      //     "id:'"+ e.id+"',"+
      //     "category:'"+ e.category+"',"+
      //     "title:'"+ e.title+"',"+
      //     "assignees:'"+ e.assignees +
      //   "'}",
      //   });
      var raw = JSON.stringify({
        pid: pid,
        "task":  "{"+
          "\"progress\":"+ e.progress+","+
          "\"id\":\""+ e.id+"\","+
          "\"category\":"+ e.category+","+
          "\"title\":\""+ e.title+"\","+
          "\"assignees\":\""+ e.assignees +
        "\"}",
        });

      var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      };

      fetch("http://localhost:3000/api/addTask", requestOptions)
      .then((response) => response.text())
      .then((result) => {
          console.log(JSON.parse(result));
      })
      .catch((error) => console.log("error", error));
      }
  }

  /*const updateTask= (e) => {
    if(pid)
  {
      //const val = e.target.value;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
      pid: pid,
      "task":  {
        progress: e.progress,
        id: e.id,
        category: e.category,
        title: e.title,
        assignees: e.assignees
      },
      });

      var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      };

      fetch("http://localhost:3000/api/addTask", requestOptions)
      .then((response) => response.text())
      .then((result) => {
          console.log(JSON.parse(result));
      })
      .catch((error) => console.log("error", error));
      }


  }*/

  useEffect(() => {
    if(user.uid)
    {
      switchProjPage(user.uid, "#Scrum")
      setReady(true);
    }
  }, []);

  const onDragEnd = (re) => {
    if (!re.destination) return;
    let newBoardData = boardData;
    var dragItem =
      newBoardData[parseInt(re.source.droppableId)].items[re.source.index];
    newBoardData[parseInt(re.source.droppableId)].items.splice(
      re.source.index,
      1
    );
    newBoardData[parseInt(re.destination.droppableId)].items.splice(
      re.destination.index,
      0,
      dragItem
    );
    setBoardData(newBoardData);
  };

  const onTextAreaKeyPress = (e) => {
    if(e.keyCode === 13) //Enter
    {
      const val = e.target.value;
      const fields = val.split("-");
      if(val.length === 0) {
        setShowForm(false);
      }
      else {
        
        const boardId = e.target.attributes['data-id'].value;
        const item = {
          progress: boardId,
          id: createGuidId(),
          title: fields[0],
          category: parseInt(fields[1]),
          assignees: [fields[2]]
        }
        addTask(item)
        let newBoardData = boardData;
        newBoardData[boardId].items.push(item);
        setBoardData(newBoardData);
        setShowForm(false);
        e.target.value = '';
      }
    }
  }
  return (
    <div className="p-10 flex flex-col h-screen">
    
      {/* {tasks?.map((task)=>console.log( task))} */}
      {ready && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-3 gap-7 my-3">
              {boardData.map((board, bIndex) => {
                return (
                  <div key={board.name}>
                    <Droppable droppableId={bIndex.toString()}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <div
                            className={`bg-gray-100 rounded-md shadow-md
                            flex flex-col relative overflow-hidden 
                            ${snapshot.isDraggingOver && "bg-green-100"}`}
                          >
                            <span
                            className={`w-full h-1 absolute inset-x-0 top-0 bg-gradient-to-r
                              ${
                                board.name == "Backlog Tasks"
                                  ? "from-red-500 to-red-200"
                                  : board.name == "In Progress"
                                  ? "from-yellow-500 to-yellow-200"
                                  : "from-green-500 to-green-200"
                              }
                              `}
                            ></span>
                            <h4 className=" p-3 flex justify-between items-center mb-2">
                              <span className="text-2xl text-gray-600">
                                {board.name}
                              </span>
                            </h4>

                            <div className="overflow-y-auto overflow-x-hidden h-auto"
                            style={{maxHeight:'calc(100vh - 290px)'}}>
                              {board.items.length > 0 &&
                                board.items.map((item, iIndex) => {
                                  return (
                                    <ScrumTask
                                      key={item.id}
                                      data={item}
                                      index={iIndex}
                                      className="m-3"
                                    />
                                  );
                                })}
                              {provided.placeholder}
                            </div>
                            
                            {
                              showForm && selectedBoard === bIndex ? (
                                <div className="p-3">
                                  <textarea className="border-gray-300 rounded focus:ring-purple-400 w-full" 
                                  rows={3} placeholder="Format: 'Task Name-Category-Assignees' Categories: 0 is Frontend, 1 is Backend, 2 is Other" 
                                  data-id={bIndex}
                                  onKeyDown={(e) => onTextAreaKeyPress(e)}/>
                                </div>
                              ): (
                                <button
                                  className="flex justify-center items-center my-3 space-x-2 text-lg"
                                  onClick={() => {setSelectedBoard(bIndex); setShowForm(true);}}
                                >
                                  <span>Add task</span>
                                  <PlusCircleIcon className="w-5 h-5 text-gray-500" />
                                </button>
                              )
                            }
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}
    </div>
  );
}
