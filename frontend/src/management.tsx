import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/sidebar';
import Select from 'react-select'

import { AlertDestructive } from "./components/Alert";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {Button} from "@/components/ui/button";

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
import { taskSchema, Task } from "./components/tasks/schema"
import { useNavigate } from 'react-router-dom';


const statuses = [
  { value: 0, label: "todo" },
  { value: 1, label: "in progress" },
  { value: 2, label: "done" },
  { value: 3, label: "stuck" },
  { value: 4, label: "canceled" },
];

const priorities = [
  { label: "low", value:0 },
  { label: "medium", value: 1 },
  { label: "high", value: 2 },
];

const mapStatus = (status) => {
  const statusObj = statuses.find(s => s.value === status);
  return statusObj ? statusObj.label : "Unknown";
}

const mapPriority = (priority) => {
  const priorityObj = priorities.find(p => p.value === priority);
  return priorityObj ? priorityObj.label : "Unknown";
}

export default function Management() {
  const [usrData, setUsrData] = useState(JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"Groups":["Student"]}'));
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sequentialId, setSequentialId] = useState(1); 
  const [form, setForm] = useState(false); 
  const [deptUsers, setDeptUsers] = useState([]); 
  const history = useNavigate();

  const [taskUsers, setTaskUsers] = useState(); 
  const [department, setDepartment] = useState(null); 
  const [title, setTitle] = useState(null); 
  const [description, setDescription] = useState(null); 
  const [dueDate, setDueDate] = useState(null); 
  const [priority, setPriority] = useState(0);  
  if (usrData["Groups"][0] === "Member" || usrData["Groups"][0] === "") {
    history("/");
  }

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

    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No access token found");
      // Handle missing token case (e.g., redirect to login)
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post("http://127.0.0.1:8000/assigntasks/", {
        email: usrData["Email"],
      },{
        headers: {
          Authorization: `Bearer ${token}`,
      }});

      

      // Format data to fit the schema
      const formattedData = response.data.map((task, index) => ({
        id: task.id.toString(),
        title: task.task_title,
        status: mapStatus(task.task_status),
        assigned_to: task.assigned_users.map(user => user.username).join(", "),
        assigned_by: task.created_user.username,
        priority: mapPriority(task.priority),
        department: task.department.name,
      }));
      setData(formattedData);
      setSequentialId(response.data.length + 1); // Set next sequential ID
      setLoading(false);

    } catch (error) {
        console.error("Error fetching data", error);
        setError(error);
    }
  };

  const fetchUsers = async(event) => {
    const token = localStorage.getItem("access_token");
    console.log(department);
    const response2 = await axios.post("http://127.0.0.1:8000/getusersbydept/", {
      department:event.label,
    },{
      headers: {
        Authorization: `Bearer ${token}`,
    }});
    setDeptUsers(response2.data);
  }

  useEffect(() => {
    fetchData();
    localStorage.setItem("statusChange", JSON.stringify("false"));
  }, [localStorage.getItem("statusChange")]);


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
const handleDepartment = (event) => {
  setDepartment(event);
  fetchUsers(event);
  setTaskUsers(null);
};

const handleSubmit = async() => {
  try{
  const token = localStorage.getItem("access_token");
    const response2 = await axios.post("http://127.0.0.1:8000/newtask/", {
      department:department.label,
      task_title:title,
      task_description:description,
      task_due_date:dueDate,
      priority:priority,
      created_user:usrData["Id"],
      assigned_users:taskUsers

    },{
      headers: {
        Authorization: `Bearer ${token}`,
    }});
    setForm(false);
    setTitle("");
    setDepartment();
    setDescription();
    setDueDate();
    setPriority(0);
  } catch(error){
    console.log(error)
  }

}

  return (
    <div className='flex'>
      <Sidebar name="Management" />
      <div className=" px-[7vw] w-[85vw] h-fit flex-1 flex-col space-y-8 p-8 absolute right-0 top-0 mt-5">
        <div className="flex items-center justify-between space-y-2">
          <div className="w-full relative">
            <h2 className="text-3xl font-bold tracking-tight">Assign Tasks</h2>
            <p className="text-muted-foreground mb-[2vh]">
              Here is where you can assign tasks to your team.
            </p>
            <Button onClick={()=>{setForm(true)}}  className="absolute -bottom-[2vh] right-0 border-white border !py-[0.25vh] px-[1vw]">+ Add</Button>
          </div>
        </div>
        <DataTable data={data} columns={columns}  />
      </div>
      {form?
      <div className="flex absolute w-screen z-50 h-screen bg-black">
        <Button className="absolute right-[1.5vh] top-[1.5vh] hover:text-red-200 " onClick={()=>{setForm(false)}} >close</Button>
        <form onSubmit={handleSubmit} className = "w-[50%] mx-auto h-fit my-auto  flex flex-col ">
          <h1 className="text-center font-bold text-[3.5ch]">Assign a Task</h1>
          <h2 className="text-center text-gray-400  text-[1.9ch] mb-[5vh]">Please create and assign a task to a department or an individial.</h2>
          <Label className="text-lg mb-1">Task Title</Label>
          <input type="text" className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh]" placeholder="Send Outreach Messages" onChange={(e) => setTitle(e.target.value)} required></input>
          <Label className="text-lg mt-[3vh] mb-1">Department</Label>
          <Select className="my-react-select-container "
          classNamePrefix="my-react-select"   options={usrData["Teamlead"].map(item => ({ label: item, value: item }))} value={department} onChange={handleDepartment}    required  placeholder={`Please select a department`}/>
          <Label className="text-lg mt-[3vh] mb-1">Users</Label>
          <Select className="my-react-select-container "
          classNamePrefix="my-react-select"   options={deptUsers} value={taskUsers} onChange={(e)=>{setTaskUsers(e)}} isMulti isDisabled={department===null} required  placeholder={`${department===null?'Please select a department to continue':'Select all Users to be assigned'}`}/>
          
          <Label className="text-lg mt-[3vh] mb-1">Description</Label>
          <textarea type="text" className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh] mb-[2vh] resize-none" placeholder="Send messages to outside organizations for outreach" onChange={(e) => setDescription(e.target.value)} required  rows={2}></textarea>
          <Label className="text-lg mt-[3vh] mb-1">Due Date and Priority</Label>
          <div className='flex'>
          <input type="date"  className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh] w-1/2" placeholder="Send Outreach Messages" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required></input>
          <select required className="bg-black border-[0.5px] border-gray-500 rounded-lg px-[1vw] py-[1vh] w-1/2" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="0" className="text-[red]" >↓ Low</option>
            <option value="1">→ Medium</option>
            <option value="2">↑ High</option>
          </select>
          </div>
          <button type="submit" className="bg-[#1E86FF] text-white rounded-lg py-[1vh] px-[1vw] mt-[3vh]">Submit</button>
        </form>
      </div>
      :null}
    </div>
  );
}

