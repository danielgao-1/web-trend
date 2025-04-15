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
  posts_24hours: number;
  posts_48hours: number;
  posts_7days: number;
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
    sortUndefined: 'last',
    sortDescFirst: false,
  }),
  columnHelper.accessor("subscribers", {
    header: () => 'Subscribers',
    cell: (info) => info.getValue().toLocaleString(),
  
  }),
  columnHelper.accessor("total_comments", {
    header: () => "Comments",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
   
  }),
  columnHelper.accessor("posts_4hours", {
    header: () => "Post Volume (1h)",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
  }),
  columnHelper.accessor("posts_24hours", {
    header: () => "Post Volume (2h)",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
  }),
  columnHelper.accessor("posts_48hours", {
    header: () => "Post Volume (12h",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
  }),
  columnHelper.accessor("posts_7days", {
    header: () => "Post Volume (24h)",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
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
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });

  const [columnVisibility, setColumnVisibility] = useState({
    posts_4hours: true, 
    posts_24hours: false,
    posts_48hours: false,
    posts_7days: false,
  });

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
    setColumnVisibility,
    defaultColumn: {
      size: 350,
      minSize: 50,
      maxSize: 500,
    },
    state: {
      sorting,
      columnFilters: [{ id: 'name', value: filterValue }],
      columnVisibility,
      expanded: true,
      pagination,
    },
    onColumnFiltersChange: (newFilters) => {
      setColumnFilters(newFilters); // update columnFilters state
      const nameFilter = newFilters.find(filter => filter.id === 'name');
      setFilterValue(nameFilter ? nameFilter.value : ''); // update filterValue state
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };
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
    <div className="table">
       <div className="nothing-container">
      <div className="top-container">
        <FilterComponent filterValue={filterValue} setFilterValue={setFilterValue} />
        <select 
        onChange={(e) => {
        const selected = e.target.value;
        setColumnVisibility({
          posts_4hours: selected === "posts_4hours",
          posts_24hours: selected === "posts_24hours",
          posts_48hours: selected === "posts_48hours",
          posts_7days: selected === "posts_7days",
        });}}
        >
        <option value="posts_4hours"> Past 1 Hours</option>
        <option value="posts_24hours"> Past 2 Hours</option>
        <option value="posts_48hours"> Past 12 Hours</option>
        <option value="posts_7days"> Past 24 Hours</option>
        </select>
        <button 
          className="export-button"
          onClick={() => exportExcel(table.getFilteredRowModel().rows)}>
            Export
          </button>
        </div>

         
          </div>
      <div className="table-container">
        
        <table>
          
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                )
              })}
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
      <div className="bottom-container">
      <div className="buttons">
        <button
          className="border rounded"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'|<'}
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
          {'>|'}
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
