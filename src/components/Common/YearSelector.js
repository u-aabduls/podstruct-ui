import React, { useContext, useState } from "react";
import Select from 'react-select'
import "../../styles/app/widgets/select.css";

const options = [];

const customStylesDefault = {
  container: provided => ({
    ...provided,
    width: `30%`,
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled ? "#D3D3D3" : ""
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
    border: '1px solid #f05050 !important'
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