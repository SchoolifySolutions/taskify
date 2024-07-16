import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/sidebar';


import { columns } from "./components/tasks/columns"
import { DataTable } from "./components/tasks/data-table"
import {  Task } from "./components/tasks/schema"

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

const mapStatus = (status:any) => {
  const statusObj = statuses.find(s => s.value === status);
  return statusObj ? statusObj.label : "Unknown";
}

const mapPriority = (priority:any) => {
  const priorityObj = priorities.find(p => p.value === priority);
  return priorityObj ? priorityObj.label : "Unknown";
}

export default function TaskPage() {
  const usrData=JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Age":0,"Username":"Login","Id":-999,"userType":"Student"}');
  const [data, setData] = useState<Task[]>([]);
  /*
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
  };*/

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post("http://127.0.0.1:8000/department_tasks/", {
        email: usrData["Email"],
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        }});
      console.log(response.data);
      // Format data to fit the schema
      const formattedData = response.data.map((task:any) => ({
        id: task.id.toString(),
        title: task.task_title,
        status: mapStatus(task.task_status),
        assigned_to: task.assigned_users.map((user:any) => user.username).join(", "),
        assigned_by: task.created_user.username,
        priority: mapPriority(task.priority),
        department: task.department.name,
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
      fetchData();
      window.addEventListener('storage', () => {
        console.log(localStorage.getItem('statusChange'));
      });
  }, []);
 


  const formatDepartments = (departments: any[]) => {
    if (departments.length === 0) return "";
    
    const firstTwoDepartments = departments.slice(0, 2).join(' and ');
    const moreDepartmentsCount = departments.length - 2;
    
    if (moreDepartmentsCount > 0) {
        return `${firstTwoDepartments} department(s) and ${moreDepartmentsCount} more`;
    } else {
        return `${firstTwoDepartments} department(s)`;
    }
};

  return (
    <div className='flex'>
      <Sidebar name="Department" />
      <div className=" px-[7vw] w-[85vw] h-fit flex-1 flex-col space-y-8 p-8 absolute right-0 top-0 mt-5">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Department Tasks</h2>
            <p className="text-muted-foreground mb-[2vh]">
              Here are the tasks for the {formatDepartments(usrData.Departments)}.
            </p>
          </div>
        </div>
        <DataTable data={data} columns={columns}  />
      </div>
    </div>
  );
}