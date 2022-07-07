import React, { useContext, useState } from "react";
import Select from 'react-select'
import "../../styles/app/widgets/select.css";

const options = [];

const customStylesDefault = {
  container: provided => ({
    ...provided,
    width: `30%`,
    height: "2.1875rem",
    fontWeight: "400",
    lineHeight: "1.52857",
    color: "#495057",
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    borderRadius: "0.25rem"
  }),
  control: provided => ({
    ...provided,
    height: "2.1875rem",
    fontWeight: "400",
    lineHeight: "1.52857",
    color: "#495057",
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    borderRadius: "0.25rem"
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled ? "#c2c2c244" : "",
    color: "#b7bac9"
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#b7bac9",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled ? "#c2c2c244" : ""
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    backgroundColor: "#918F90" 
  }),
  dropdownIndicator: (provided, state) => ({
     ...provided,
    color: state.isDisabled ? "#918F90" : ""
   })
};

const customStylesError = {
  container: provided => ({
    ...provided,
    width: `28.5%`,
    margin: `0% 1.5% 0% 0%`,
  }),
  control: (provided) => ({
    ...provided,
    border: '1px solid #f05050'
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
      styles={!props.hasError ? customStylesDefault : customStylesError}
      options={options}
      value={options.find(o => o.value === props.defaultv)}
      onChange={(e) => { props.setYear(e.value) }}
      isDisabled={props.disabled}
    />
  )
}