import { useState, useEffect } from "react";
import { 
    Column,
    ColumnFiltersState,
    RowData,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    createColumnHelper,
    useReactTable,
    SortingState,
} from "@tanstack/react-table";
import useSubreddits from "./UseSubreddits";

// typescript alias - type of the data
type Subreddit = { 
  name: string;
  subscribers: number;
  url: string;
};

// column helper instance
const columnHelper = createColumnHelper<Subreddit>();

// create columns array
const columns = [
  columnHelper.accessor("name", {
    header: () => "Subreddit",
    cell: (info) => info.getValue(),
    size: 200,
  }),
  columnHelper.accessor("subscribers", {
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting()}
        style={{ cursor: "pointer", fontWeight: "bold" }}
        > 
        Subscriber 
        {column.getIsSorted() === "asc" ? "🔼" : column.getIsSorted() === "desc" ? "🔽" : null}
      </button>
    ),
    cell: (info) => info.getValue().toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor("url", {
    header: () => "url",
    cell: (info) => info.getValue(),
  }),
];


const UserTable = () => {

  const subreddits = useSubreddits();

  //sorting state
  const [sorting, setSorting] = useState<SortingState>([]);

  // filter state - not finished
  const [columnFilters, setColumnFilters] = useState([
    {
        id: "task",
        value: "Add?"
    }
  ])
  // const [sorting, setColumnSort]
  // Create table instance
  const table = useReactTable({
    data: subreddits,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // client side pagination
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: false, //turn off page reset? of pageIndex
    // client-side sorting
    onSortingChange: setSorting,
    state: {
        sorting,
    } 
  })

  console.log(table.getState().sorting)

  return (
    <div className="dashboard">
      <div className="table-section">
        <div className="table-container">
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
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="border rounded"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="border rounded"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="border rounded"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
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
    </div>
  );
};

export default UserTable;
