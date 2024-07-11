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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'To do';
      case 1:
        return 'In Progress';
      case 2:
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  // Function to open popover
  const openPopover = (event) => {
    // Implement popover open logic here
    console.log('Popover opened');
  };

  return (
    <div className='flex'>
      <Sidebar name="Tasks" />
      {error &&
        <AlertDestructive description={error.message} />
      }
      <div className="p-4 rounded-xl">
        <table className="min-w-full  border border-gray-600 rounded-lg">
          <thead>
            <tr>
              <th className=" border-gray-300 p-2">ID</th>
              <th className=" border-gray-300 p-2">Title</th>
              <th className=" border-gray-300 p-2">Description</th>
              <th className=" border-gray-300 p-2">Due Date</th>
              <th className=" border-gray-300 p-2">Status</th>
              <th className=" border-gray-300 p-2">Department</th>
              <th className=" border-gray-300 p-2">Assigned To</th>
              <th className=" border-gray-300 p-2">Created By</th>
            </tr>
          </thead>
          <tbody>
            {data.map(task => (
              <tr key={task.id}>
                <td className=" border-gray-300 p-2">{task.sequentialId}</td> {/* Display sequential ID */}
                <td className=" border-gray-300 p-2">{task.task_title}</td>
                <td className=" border-gray-300 p-2">{task.task_description}</td>
                <td className=" border-gray-300 p-2">{new Date(task.task_due_date).toLocaleString()}</td>
                <td className=" border-gray-300 p-2">{getStatusText(task.task_status)}</td>
                <td className=" border-gray-300 p-2">{task.department.name}</td>
                <td className=" border-gray-300 p-2 flex">
                  {task.assigned_users.slice(0, 2).map((user, index) => (
                    <Avatar key={index} className={`${getColorByIndex(index)} text-black font-semibold ${index === 1 ? '-ml-[0.5vw] z-5' : 'z-10'}`}>
                      <AvatarImage src={`cjd.com/user/${user.id}`} />
                      <AvatarFallback>{user.initials.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ))}
                  {task.assigned_users.length > 2 && (
                    <Avatar className={` text-white font-semibold `}>
                     <AvatarImage src={`cjd.com/user/`} />
                     <AvatarFallback>+{task.assigned_users.length - 2}</AvatarFallback>
                   </Avatar>
                  )}
                </td>
                <td className=" border-gray-300 p-2">
                  <Avatar className={` text-black font-semibold ${getColorByIndex(0)}`}>
                     <AvatarImage src={`cjd.com/user/`} />
                     <AvatarFallback>{task.created_user.initials.toUpperCase()}</AvatarFallback>
                   </Avatar>
                </td>
                {/* Popover Trigger */}
                <td className=" border-gray-300 p-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Show Dialog</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
