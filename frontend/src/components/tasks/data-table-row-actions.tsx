import { Row } from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Trash2Icon, MoreHorizontalIcon } from "lucide-react"; // Import the three dots icon
import { taskSchema } from "./schema";
import { statuses, priorities } from "./data";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isPopupVisible, setPopupVisible] = useState(false); // State for popup visibility
  const [tasks, setTask] = useState<any>({ "task_description": "Loading...", "task_due_date": "2024-10-10" });
  const [due_date, set_Due_Date] = useState("");


  const task = taskSchema.parse(row.original);
  const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"Groups":["Student"]}');

  const formatDate = (inputDate: string) => {
    // Create a new Date object from the input string
    const date = new Date(inputDate);

    // Extract the components of the date
    const month = date.getMonth() + 1; // Months are 0-based
    const day = date.getDate();
    const year = date.getFullYear();

    // Format the date as MM-DD-YYYY
    set_Due_Date(`${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`);
  };
  const priority = priorities.find(
    (priority) => priority.value === task.priority
  );

  const status = statuses.find(
    (status) => status.value === task.status
  );


  const handleDelete = async (e: React.MouseEvent, task: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }
      await axios.post(
        `${import.meta.env.VITE_URL}deletetask/`,
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
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const getTaskDetails = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }
      const response = await axios.post(
        `${import.meta.env.VITE_URL}gettaskbyid/`,
        {
          task_id: task.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTask(response.data)
      formatDate(response.data.task_due_date)

    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => { getTaskDetails() }, [])

  const handleMoreClick = () => {
    setPopupVisible(true); // Show the popup when the three dots are clicked
  };

  return (
    <div className="w-fit flex items-center space-x-2">
      <AlertDialog>
        <AlertDialogTrigger>
          <Button
            disabled={usrData['Groups'][0] === 'Member'}

            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <Trash2Icon className="h-4 w-4" />
            <span className="sr-only">Delete task</span>
          </Button></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e: any) => { handleDelete(e, task) }}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
        <div className="fixed inset-0 flex justify-center z-50 bg-black bg-opacity-95">
          <div className="w-screen h-screen">
            <Button className="absolute right-4 top-4 hover:text-[red]" onClick={() => setPopupVisible(false)}>
              close
            </Button>
            <div className="w-[60vw] mx-auto mt-[15vh] my-auto">
              <h1 className="text-left font-bold text-4xl mb-16">{task.title}</h1>
              <div className="flex gap-4  mb-[3vh]" >
              <HoverCard>
              <HoverCardTrigger>
                <Button variant="outline">
                  <span className="text-white text-lg">{due_date}</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-fit px-[1vw] py-[1vh] border-gray-600 bg-black">
                Due: {due_date}
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
            <HoverCardTrigger>
                <Button variant="outline"  className={`text-lg  ${priority.class}`}><priority.icon
                  className={`mr-1 h-4 w-4 text-muted-foreground my-auto `}
                />
                  <span className="">{priority.label}</span>
                </Button>
                </HoverCardTrigger>
              <HoverCardContent className="w-fit px-[1vw] py-[1vh] border-gray-600 bg-black">
                Priority: {priority.label}
              </HoverCardContent>
            </HoverCard>
                
              <HoverCard>
              <HoverCardTrigger>
                <Button variant="outline" className={`text-lg  ${status.class}`}><status.icon className={`mr-1 h-4 w-4 text-muted-foreground my-auto `}/>
                  <span className="h-fit">{status.label}</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-fit px-[1vw] py-[1vh] border-gray-600 bg-black">
                Status: {status.label}
              </HoverCardContent>
            </HoverCard>
              
            <HoverCard>
            <HoverCardTrigger>
              <Button variant="outline">
                <span className="text-white text-center justify-center text-lg  rounded-xl">{task.department}</span>
              </Button>
            </HoverCardTrigger>
              <HoverCardContent className="w-fit px-[1vw] py-[1vh] border-gray-600 bg-black">
                Department: {task.department}
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger>
                <Button variant="outline">
                  <span className="text-white text-center justify-center text-lg  rounded-xl">{task.assigned_by}</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-fit px-[1vw] py-[1vh] border-gray-600 bg-black">
                Assigned By: {task.assigned_by}
              </HoverCardContent>
            </HoverCard>
            
            </div>


          </div>
          

          <h2 className="text-left text-gray-400 text-lg mb-5 padding-5 max-w-[60vw] mx-auto">
            Assigned To: {task.assigned_to}
          </h2>
          <h2 className="text-left text-gray-300 text-lg   max-w-[60vw] mx-auto padding-5">
            {tasks.task_description}
          </h2>
        </div>
        </div>
      )}
    </div>
  );
}
