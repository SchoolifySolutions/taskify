import { ColumnDef } from "@tanstack/react-table";



// This type is used to define the shape of our data.
export type Task = {
  title: string;
  status: "To Do" | "In Progress" | "Completed" | "Queued";
  due_date: Date;
  department: string;
  created_by: string;
  assigned_to: string;
};

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "created_by",
    header: "Created By",
  },
  {
    accessorKey: "assigned_to",
    header: "Assigned To",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    // Example of custom formatting using `cellRender`
    // cellRender: (cellData) => format(cellData, 'MM/dd/yyyy'),
  },
];