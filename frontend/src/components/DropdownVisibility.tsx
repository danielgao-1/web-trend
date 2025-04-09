import React from 'react';

const DropdownFilter = ({ options, table }) => {
  const handleChange = (event) => {
    const value = event.target.value;
    table.setGlobalFilter(value); // Set the selected value as the global filter
  };

  return (
    <select onChange={handleChange}>
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default DropdownFilter;