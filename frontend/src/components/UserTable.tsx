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
import exportIcon from '../svg_files/export-icon.svg';



// typescript alias - type of the data
type Subreddit = { 
  rank: number;
  name: string;
  subscribers: number;
  total_comments: number;
  posts_1hours: number;
  posts_2hours: number;
  posts_12hours: number;
  posts_24hours: number;
  comments_1hours: Number;
  comments_2hours: Number;
  comments_12hours: Number;
  comments_24hours: Number;
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

  columnHelper.accessor("posts_1hours", {
    header: () => "Post Volume (1h)",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
  }),
  columnHelper.accessor("posts_2hours", {
    header: () => "Post Volume (2h)",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
  }),
  columnHelper.accessor("posts_12hours", {
    header: () => "Post Volume (12h",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
  }),
  columnHelper.accessor("posts_24hours", {
    header: () => "Post Volume (24h)",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
  }),
  columnHelper.accessor("comments_1hours", {
    header: () => "Comment Volume (1h)",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
  }),
  columnHelper.accessor("comments_2hours", {
    header: () => "Comment Volume (2h)",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
  }),
  columnHelper.accessor("comments_12hours", {
    header: () => "Comment Volume (12h)",
    cell: (info) => info.getValue(),
    sortUndefined: 'last'
  }),
  columnHelper.accessor("comments_24hours", {
    header: () => "Comment Volume (24h)",
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
    posts_1hours: true, 
    posts_2hours: false,
    posts_12hours: false,
    posts_24hours: false,
    comments_1hours: false,
    comments_2hours: false,
    comments_12hours: false,
    comments_24hours: false,
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
    <div className="layout-wrapper">
       <div className="nothing-container">
      <div className="top-container">
        <div className="search-bar">
        <FilterComponent filterValue={filterValue} setFilterValue={setFilterValue} />
        </div>  
        <div className="search-bar">
       <select 
  onChange={(e) => {
    const selected = e.target.value;
    setColumnVisibility({
      posts_1hours: selected === "1h",
      posts_2hours: selected === "2h",
      posts_12hours: selected === "12h",
      posts_24hours: selected === "24h",
      comments_1hours: selected === "1h",
      comments_2hours: selected === "2h",
      comments_12hours: selected === "12h",
      comments_24hours: selected === "24h",
    });
  }}
>
  <option value="1h">Past 1 Hour</option>
  <option value="2h">Past 2 Hours</option>
  <option value="12h">Past 12 Hours</option>
  <option value="24h">Past 24 Hours</option>
</select>
</div>
        
        <button  
          className="export-button"
          onClick={() => exportExcel(table.getFilteredRowModel().rows)}>
            Export
            <img src={exportIcon} alt="Reddit logo" width={40} height={40}  style={{ marginLeft: 'auto'}} />
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
    
        <span className="dropdown"> Rows per page{' '}
      <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        > 
          {[15, 25, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
               {pageSize}
            </option>
          ))}
        </select>
        </span>
      <span className="dropdown">
         Page{' '}
         <strong>
           {table.getState().pagination.pageIndex + 1} of{' '}
           {table.getPageCount().toLocaleString()}
         </strong>
       </span>
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
        
        </div>
        </div>
    </div>
   

  );
};

export default UserTable;
