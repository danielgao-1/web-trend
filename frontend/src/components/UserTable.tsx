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
import FilterComponent from "./FilterComponent";
import "./styles.css";
import { mkConfig, generateCsv, download } from 'export-to-csv';



// typescript alias - type of the data
type Subreddit = { 
  rank: number;
  name: string;
  subscribers: number;
  total_comments: number;
  posts_4hours: number;
  time: number;
  url: string;
};

// column helper instance
const columnHelper = createColumnHelper<Subreddit>();

// create columns array
const columns = [
  columnHelper.accessor("rank", {
    header: () => "Rank",
    cell: (info) => info.getValue(),

  }),
  columnHelper.accessor("name", {
    header: () => "Subreddit",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("subscribers", {
    header: ({ column }) => (
      <button
        onClick={() => {
          const currentSorting = column.getIsSorted();
          if (currentSorting === null || currentSorting === 'desc') {
            column.toggleSorting(false); 
          } else {
            column.toggleSorting(true); 
          }
        }}
        style={{ cursor: "pointer", fontWeight: "bold" }}
      >
        Subscriber
        {column.getIsSorted() === "asc" ? "desc" : null}
      </button>
    ),
    cell: (info) => info.getValue().toLocaleString(),
    enableSorting: true,
  }),
  columnHelper.accessor("total_comments", {
    header: () => "# of Comments",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("posts_4hours", {
    header: () => "Post Volumne",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("url", {
    header: () => "url",
    cell: (info) => (
      <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
        Explore
      </a> 
    ),
  }),

];


const UserTable = () => {
  const subreddits = useSubreddits();
  // assigns each subreddit a rank based on # of subs
  const sortedSubreddits = [...subreddits].sort((a, b) => b.subscribers - a.subscribers);
  sortedSubreddits.forEach((subreddit, index) => {
    subreddit.rank = index + 1;
  });
  //sorting state
  const [sorting, setSorting] = useState<SortingState>([{ id: 'subscribers', desc: true }],);
  // filter state - not finished
  const [filterValue, setFilterValue] = useState(""); // Initialize filterValue state
  const [columnFilters, setColumnFilters] = useState([{ id: 'name', value: filterValue }]); // Initialize columnFilters state
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })
  // Create table instance
  const table = useReactTable({
    data: sortedSubreddits,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // client side pagination
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: false, // turn off page reset? of pageIndex
    // client-side sorting
    onSortingChange: setSorting,
    defaultColumn: {
      size: 350,
      minSize: 50,
      maxSize: 500,
    },
    state: {
      sorting,
      columnFilters: [{ id: 'name', value: filterValue }],
      columnVisibility: {
        id: true
       },
      expanded: true,
      pagination,
    
    },
    onColumnFiltersChange: (newFilters) => {
      setColumnFilters(newFilters); // update columnFilters state
      const nameFilter = newFilters.find(filter => filter.id === 'name');
      setFilterValue(nameFilter ? nameFilter.value : ''); // update filterValue state
    },
  });
  // export feature 
  const exportExcel = () => {
    const csvConfig = mkConfig({
      fieldSeparator: ',',
      filename: 'subreddit_data',
      decimalSeparator: '.',
      useKeysAsHeaders: true,
  });
  const rowData = table.getFilteredRowModel().rows.map((row) => row.original); //set to download current state rather than entire table
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
};
  

  console.log(table.getState().sorting)

  return (
    <div className="dashboard">
        <FilterComponent filterValue={filterValue} setFilterValue={setFilterValue} />
        <button 
          className="border rounded"
          onClick={() => exportExcel(table.getFilteredRowModel().rows)}>
            Export to Csv
          </button>
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

  );
};

export default UserTable;
