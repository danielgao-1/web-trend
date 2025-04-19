import React from "react";
import "./styles.css";

interface FilterProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
}

const FilterComponent: React.FC<FilterProps> = ({ 
  filterValue, 
  setFilterValue 
}) => {
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