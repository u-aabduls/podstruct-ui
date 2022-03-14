import React from 'react'
import Select from 'react-select'
import "../../styles/app/widgets/select.css";

const options = [];

const customStyles = {
  container: provided => ({
    ...provided,
    width: `30%`
  })
};

function setOptions() {
  const firstValidYear = new Date().getFullYear();
  var year = firstValidYear;
  while (year >= (firstValidYear - 100)) {
    options.push({ value: year.toString(), label: year.toString() });
    year--;
  }
}

export default function YearSelector(props) {
    setOptions();
    return (
      <Select
        placeholder={`Year`}
        styles={customStyles}
        options={options}
        onChange={(e) => {props.setYear(e.value)}}
      />
    )
}