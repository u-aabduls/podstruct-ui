import React from 'react'
import Select from 'react-select'
import "../../styles/app/widgets/select.css";

const options = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Aug' },
  { value: '09', label: 'Sept' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' }
];

const customStylesDefault = {
  container: provided => ({
    ...provided,
    width: `38.5%`,
    margin: `0% 1.5% 0% 0%`,
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
    width: `38.5%`,
    margin: `0% 1.5% 0% 0%`,
  }),
  control: (provided) => ({
    ...provided,
    border: '1px solid #f05050',
  })
};

export default function MonthSelector(props) {
  return (
    <Select
      classNamePrefix="test"
      placeholder={`Month`}
      styles={!props.hasError ? customStylesDefault : customStylesError}
      options={options}
      value={options.find(o => o.value === props.defaultv)}
      onChange={(e) => { props.setMonth(e.value) }}
      isDisabled={props.disabled}
    />
  )
}