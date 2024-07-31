import { Row } from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Trash2Icon, MoreHorizontalIcon } from "lucide-react"; // Import the three dots icon
import { taskSchema } from "./schema";
import { statuses, priorities } from "./data";
import { GoFileSubmodule } from "react-icons/go";
import { Label } from "../ui/label"

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
} from "../ui/alert-dialog";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isMorePopupVisible, setMorePopupVisible] = useState(false); // State for "More" popup visibility
  const [isFilePopupVisible, setFilePopupVisible] = useState(false); // State for file submission popup visibility
  const [tasks, setTask] = useState<any>({ "task_description": "Loading...", "task_due_date": "2024-10-10" });
  const [due_date, set_Due_Date] = useState("");
  const task = taskSchema.parse(row.original);
  const [Title, setTitle] = useState(""); // State for selected status
  const [Description, setDescription] = useState("");
  const [Url, setUrl] = useState("");


  
  const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"Groups":["Student"]}');

  const formatDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const month = date.getMonth() + 1; // Months are 0-based
    const day = date.getDate();
    const year = date.getFullYear();
    set_Due_Date(`${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`);
  };

  const priority = priorities.find(
    (priority) => priority.value === task.priority
  ) || { label: "No Priority", class: "", icon: () => null };

  const status = statuses.find(
    (status) => status.value === task.status
  ) || { label: "No Status", class: "", icon: () => null };

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
      setTask(response.data);
      formatDate(response.data.task_due_date);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getTaskDetails();
  }, []);

  const handleMoreClick = () => {
    setMorePopupVisible(true); // Show the "More" popup when the three dots are clicked
  };

  const handleFileClick = () => {
    setFilePopupVisible(true); // Show the file submission popup when the file icon is clicked
  };
//{usrData["Username"]===row.getValue("assigned_by") || row.getValue("assigned_to").includes(usrData["Username"])?


  return (
    <div className="w-fit flex items-center space-x-2">
      {/* File submission icon with click handler */}
      <GoFileSubmodule size={24} color={"white"} onClick={handleFileClick} />

      {/* Popup for file submission */}
      {isFilePopupVisible && (
        <div className="fixed inset-0 flex justify-center z-50 bg-black bg-opacity-95">
          <div className="w-screen h-screen">
            <Button className="absolute right-4 top-4 hover:text-[red]" onClick={() => setFilePopupVisible(false)}>
              Close
            </Button>
            <div className="w-[50%] mx-auto mt-[15vh] my-auto">
              <h1 className="text-left font-bold text-4xl mb-16">{task.title} -<br/> Progress Submission</h1>
              <Label className="text-lg mt-[3vh] mb-1">Title</Label>
              <input
            type="text"
            className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh] w-full"
            placeholder="Finished Home Page"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="block mt-[3vh]">
          <Label className="text-lg mt-[3vh] mb-1">Description</Label>
          <textarea className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh] mb-[2vh] resize-none w-full" placeholder="Send messages to outside organizations for outreach" onChange={(e) => setDescription(e.target.value)} required  rows={2}></textarea>
          
          </div>
          <Label className="text-lg mt-[3vh] mb-1">Image Url</Label>
              <input
            type="url"
            className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh] w-full"
            placeholder="https://drive.google.com/..."
            onChange={(e) => setUrl(e.target.value)}
            required
          />
              
            </div>
          </div>
        </div>
      )}

      <AlertDialog>
        <AlertDialogTrigger>
          <Button
            disabled={usrData['Groups'][0] === 'Member'}
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <Trash2Icon className="h-4 w-4" />
            <span className="sr-only">Delete task</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-black">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className={"border bg-[red]/70 border-[red]/50"} onClick={(e: any) => { handleDelete(e, task) }}>Delete</AlertDialogAction>
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
      {isMorePopupVisible && (
        <div className="fixed inset-0 flex justify-center z-50 bg-black bg-opacity-95">
          <div className="w-screen h-screen">
            <Button className="absolute right-4 top-4 hover:text-[red]" onClick={() => setMorePopupVisible(false)}>
              Close
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
                    <Button variant="outline" className={`text-lg  ${priority.class}`}>
                      <priority.icon className={`mr-1 h-4 w-4 text-muted-foreground my-auto `} />
                      <span className="">{priority.label}</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-fit px-[1vw] py-[1vh] border-gray-600 bg-black">
                    Priority: {priority.label}
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger>
                    <Button variant="outline" className={`text-lg  ${status.class}`}>
                      <status.icon className={`mr-1 h-4 w-4 text-muted-foreground my-auto `} />
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
                      <span className="text-white text-center justify-center text-lg rounded-xl">{task.department}</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-fit px-[1vw] py-[1vh] border-gray-600 bg-black">
                    Department: {task.department}
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger>
                    <Button variant="outline">
                      <span className="text-white text-center justify-center text-lg rounded-xl">{task.assigned_by}</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-fit px-[1vw] py-[1vh] border-gray-600 bg-black">
                    Assigned By: {task.assigned_by}
                  </HoverCardContent>
                </HoverCard>

              </div>
              <h2 className="text-left text-gray-400 text-lg mb-5 padding-5 max-w-[60vw] mx-auto">
                Assigned To: {task.assigned_to}
              </h2>
              <h2 className="text-left text-gray-300 text-lg max-w-[60vw] mx-auto padding-5">
                {tasks.task_description}
              </h2>

              {/* Select field for changing task status */}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}