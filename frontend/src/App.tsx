import { useState, useEffect} from "react";
import { 
  createColumnHelper,
  flexRender,
  getCoreRowModel, 
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import './App.css';


// typescript alias - type of the data
export type Subreddit = { 
  name: string;
  title: string;
  subscribers: number;
};

// column helper instance
const columnHelper = createColumnHelper<Subreddit>();

// create columns array
const columns = [
  columnHelper.accessor("name", {
    header: () => "Subreddit",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("title", {
    header: () => "Title",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("subscribers", {
    header: () => "Subscribers",
    cell: (info) => info.getValue(),
  }),
];


const UserTable = () => {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);

  // fetch data from backend API
  useEffect(() => {
    const fetchData = async () => { 
      try {
        const response = await fetch("http://localhost:3000/api/top-subreddits");
        if (response.ok) {
          const data = await response.json();
          setSubreddits(data);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); 

  // Create table instance
  const table = useReactTable({
    data: subreddits,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // client side pagination
    autoResetPageIndex: false, //turn off page reset? of pageIndex
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index 
        pageSize: 25, //custom default page size
      },
    },
  });

  return (
    <div className="overivew">
      <div className="table">
      <table className="users-table"> 
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="users-table-cell">
                  <div>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>                        
            </th>
          ))}
          </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="buttons">
        <button
          className="border rounded"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}>
            {'<<'}
        </button>
        <button
          className="border rounded"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
            {'<'}
        </button>
        <button
          className="border rounded"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
            {'>'}
        </button>
        <button
          className="border rounded"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}>
            {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default UserTable;
