import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/sidebar';

import { AlertDestructive } from "./components/Alert";
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
} from "@/components/ui/alert-dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import Image from "next/image"
import { z } from "zod"

import { columns } from "./components/tasks/columns"
import { DataTable } from "./components/tasks/data-table"
import { taskSchema } from "./components/tasks/schema"



export default function TaskPage() {
  const [usrData, setUsrData] = useState(JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"userType":"Student"}'));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sequentialId, setSequentialId] = useState(1); // Initialize sequential ID counter

  const getColorByIndex = (index: number) => {
    const colors = [
      'bg-[#fca5f1]', // pink
      'bg-[#6ee7b7]', // green
      'bg-[#7b61ff]', // purple
    ];
    const colors2 = [
      'bg-[#ff7e67]', // red
      'bg-[#62d4e3]', // blue
      'bg-[#f9a826]', // yellow
    ];
  
    if (index === 0) {
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      return colors2[Math.floor(Math.random() * colors2.length)];
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/department_tasks/", {
        email: usrData["Email"],
      });
      console.log(response.data);
      // Assign sequential IDs to tasks
      const tasksWithSequentialId = response.data.map((task, index) => ({
        ...task,
        sequentialId: index + 1,
      }));
      setData(tasksWithSequentialId);
      setSequentialId(response.data.length + 1); // Set next sequential ID
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const formatDepartments = (departments: any[]) => {
    if (departments.length === 0) return "";
    
    const firstTwoDepartments = departments.slice(0, 2).join(' and ');
    const moreDepartmentsCount = departments.length - 2;
    
    if (moreDepartmentsCount > 0) {
        return `${firstTwoDepartments} and ${moreDepartmentsCount} more`;
    } else {
        return firstTwoDepartments;
    }
};

  // Function to open popover


  return (
    <div className='flex'>
      <Sidebar name="Tasks" />
      <div className=" px-[7vw] w-[85vw] h-fit flex-1 flex-col space-y-8 p-8 absolute right-0 top-0 mt-5">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Tasks</h2>
            <p className="text-muted-foreground mb-[2vh]">
              Here are the tasks for the {formatDepartments(usrData.Departments)}.
            </p>
          </div>
        </div>
        <DataTable data={{}} columns={columns} />
      </div>
    </div>
      
  );
}
