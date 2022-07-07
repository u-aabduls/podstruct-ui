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