import { useState } from "react";
import { 
  createColumnHelper, 
  getCoreRowModel, 
  useReactTable 
} from "@tanstack/react-table";
import demoData from "./MOCK_DATA.json";

// Typescript alias - type of the data
export type User = { // Export keyword shares the User Type with others
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  university: string;
};

// Column helper instance
const columnHelper = createColumnHelper<User>();

// Create columns array
const columns = [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("first_name", {
    header: () => "First Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("last_name", {
    header: () => "Last Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("gender", {
    header: () => "Gender",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("university", {
    header: () => "University",
    cell: (info) => info.getValue(),
  }),
];

const UserTable = () => {
  const [users, setUsers] = useState<User[]>(demoData);

  // Create table instance
  const table = useReactTable({
    data: users,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table className="users-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>{header.column.columnDef.header?.()}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.renderValue()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
