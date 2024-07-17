import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Trash2Icon, MoreHorizontalIcon } from "lucide-react"; // Import the three dots icon
import { taskSchema } from "./schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isPopupVisible, setPopupVisible] = useState(false); // State for popup visibility

  const task = taskSchema.parse(row.original);
  const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"Groups":["Student"]}');
  
  const handleDelete = async (e: React.MouseEvent, task: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }
      const response = await axios.post(
        "https://schoolifys.pythonanywhere.com/deletetask/",
        {
          task_id: task.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
      console.log(response);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleMoreClick = () => {
    setPopupVisible(true); // Show the popup when the three dots are clicked
  };

  return (
    <div className="w-fit flex items-center space-x-2">
      <Button
        disabled={usrData['Groups'][0] === 'Member'}
        onClick={(e) => { handleDelete(e, task) }}
        variant="ghost"
        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
      >
        <Trash2Icon className="h-4 w-4" />
        <span className="sr-only">Delete task</span>
      </Button>

      {/* Button for three dots that triggers the popup */}
      <Button
        variant="ghost"
        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        onClick={handleMoreClick} // Add click handler to show popup
      >
        <MoreHorizontalIcon className="h-4 w-4" />
        <span className="sr-only">More</span>
      </Button>

      {/* Popup for additional options */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex justify-center z-50 bg-black bg-opacity-90">
          <div className="mt-[25vh]">
            <Button className="absolute right-4 top-4 hover:text-red-200" onClick={() => setPopupVisible(false)}>
              Close
            </Button>
            <h1 className="text-center font-bold text-4xl mb-20">Task Details</h1>
            <h2 className="text-center text-gray-600 text-lg mb-3 padding-5">
              Task Title: {task.title}
            </h2>
            <h2 className="text-center text-gray-600 text-lg mb-3 padding-5">
              Task Description: {task.task_description}
            </h2>
            <h2 className="text-center text-gray-600 text-lg mb-3 padding-5">
              Task Due Date: {task.date}
            </h2>
            <h2 className="text-center text-gray-600 text-lg mb-3 padding-5">
              Task Priority: {task.priority}
            </h2>
            <h2 className="text-center text-gray-600 text-lg mb-3 padding-5">
              Task Status: {task.status}
            </h2>
            <h2 className="text-center text-gray-600 text-lg mb-3 padding-5">
              Department: {task.department}
            </h2>
            <h2 className="text-center text-gray-600 text-lg mb-5 padding-5">
              Assigned To: {task.assigned_to}
            </h2>
            <h2 className="text-center text-gray-600 text-lg mb-5 padding-5">
              Assigned By: {task.assigned_by}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
