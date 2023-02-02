import React from "react";
import Select from 'react-select';

const options = [];

const customStylesDefault = {
  container: provided => ({
    ...provided,
    width: `30%`,
    height: "2.1875rem",
    fontWeight: "400",
    lineHeight: "1.52857",
    backgroundClip: "padding-box",
    borderRadius: "0.25rem"
  }),
  control: (provided, state) => ({
    ...provided,
    height: "2.1875rem",
    fontWeight: "400",
    lineHeight: "1.52857",
    backgroundClip: "padding-box",
    borderRadius: "0.25rem",
    border: `1px solid #dde6e9`,
    background: state.isDisabled ? "#EDF1F2" : ""
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#b7bac9",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? "#b7bac9" : "#495057"
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: "#b7bac9"
  }),
  dropdownIndicator: (provided) => ({
     ...provided,
    color: "#b7bac9"
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