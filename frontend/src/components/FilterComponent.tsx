import "./styles.css";

const FilterComponent = ({ filterValue, setFilterValue }) => {
    return (
      <input
        type="text"
        className="filter-container"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        placeholder="Filter by Subreddit"
      />
    );
  };

  export default FilterComponent;
  