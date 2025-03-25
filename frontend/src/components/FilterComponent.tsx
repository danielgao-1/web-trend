const FilterComponent = ({ filterValue, setFilterValue }) => {
    return (
      <input
        type="text"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        placeholder="Filter by name"
      />
    );
  };

  export default FilterComponent;
  