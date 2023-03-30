import React from "react";
import { Draggable } from "react-beautiful-dnd"

export default function ScrumTask({data, index }) {
  return (
    <Draggable index={index} draggableId={data.id.toString()}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-md p-3 m-3 mt-0 last:mb-0"
        >
          <label
            className={`bg-gradient-to-r
              px-2 py-1 rounded text-white text-sm
              ${
                data.category === 0
                  ? "from-orange-600 to-orange-400"
                  : data.category === 1
                  ? "from-blue-600 to-blue-400"
                  : "from-purple-600 to-purple-400"
              }
              `}
          >
            {data.category === 0
              ? "Frontend Task"
              : data.category === 1
              ? "Backend Task"
              : "Other"}
          </label>
          <h5 className="text-md my-3 text-lg leading-6">{data.title}</h5>
            <div className="flex justify-between">
                <h5 className="text-md my-1 text-sm leading-6">
                  Assigned to: {data.assignees}
                </h5>
            </div>
        </div>
      )}
    </Draggable>
  );
}