import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "bug",
    label: "Bug",
    class:""
  },
  {
    value: "feature",
    label: "Feature",
    class:""
  },
  {
    value: "documentation",
    label: "Documentation",
    class:""
  },
];

export const statuses = [

  {
    value: "stuck",
    label: "Stuck",
    icon: CrossCircledIcon,
    department: "Development",
    class:""
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
    department: "Development",
    class:""
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
    department: "Development",
    class:""
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
    department: "Development",
    class:""
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
    department: "Development",
    class:""
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
    department: "Development",
    class:"text-[limegreen]"
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
    department: "Development",
    class:"text-[orange]"
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
    department: "Development",
    class:"text-[red]"
  },
];

export const departments = [
  { value: 1, label: 'IT and Infrastructure'},
  { value: 2, label: 'Web Development' },
  { value: 3, label: 'Sales' },
  // Other departments
];
