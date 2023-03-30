import { useAuth } from "@/context/AuthContext";
import {doc,updateDoc,} from "firebase/firestore";
import { db } from "@/config/firebase";
import ScrumTask from "./ScrumTask";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import ScrumData from '../mockup_data/scrum-data.json'
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";


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
        console.log(JSON.parse(result))

        setTasks(JSON.parse(result)[0])
    })
      .catch((err) => {
        console.log(err);
      });
    
}, []);

const addTask= async ()=>{
  if(pid)
  {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
      pid: pid,
      "task":  {
        progress: "Completed",
        id:3,
        category: 2,
        title: "Update Sprint 2 document",
        assignees: "{\"assignees\": Steve, David, Jason}"
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
  }

  useEffect(() => {
    if(user.uid)
    {
      updateDoc(doc(db, "users", user.uid), {
        currentProjPage:"#Scrum"
      })
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
      if(val.length === 0) {
        setShowForm(false);
      }
      else {
        const boardId = e.target.attributes['data-id'].value;
        const item = {
          id: createGuidId(),
          title: val,
          category: 2,
          assignees: ["Placeholder"]
        }
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
      <button onClick={addTask}>AddTaskTest</button>
      <span>{tasks}</span>
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
                                  rows={3} placeholder="Task info" 
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
