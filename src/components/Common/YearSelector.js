import React from 'react'
import Select from 'react-select'

const options = [];

const customStyles = {
  container: provided => ({
    ...provided,
    width: `35%`
  })
};

function setOptions() {
  const firstValidYear = new Date().getFullYear();
  var year = firstValidYear;
  while (year >= (firstValidYear - 70)) {
    options.push({ value: year.toString(), label: year.toString() });
    year--;
  }
}

export default function YearSelector() {
    setOptions();
    return (
      <Select
        styles={customStyles}
        options={options} 
      />
    )
}