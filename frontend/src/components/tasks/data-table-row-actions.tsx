import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { labels } from "./data";
import { taskSchema } from "./schema";
import { Trash2Icon } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {


  const [task, setTask] = useState(taskSchema.parse(row.original));
  

  const handleLabelChange = (labelValue: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      label: labelValue,
    }));
  };
  const handleDelete = async (e: React.MouseEvent, task: any) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      console.log(token)
      if (!token) {
        throw new Error("Token not found in localStorage");
      }
      console.log(task.id)
      const response = await axios.post(
        "http://127.0.0.1:8000/deletetask/",
        {
          task_id: task.id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      window.location.reload();
      console.log(response);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          onClick={(e)=>{handleDelete(e,task)}}
        >
          <Trash2Icon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] !bg-black">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem  onClick={(e)=>{handleDelete(e,task)}}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
