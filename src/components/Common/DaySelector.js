import React from 'react'
import Select from 'react-select'
import "../../styles/app/widgets/select.css";

const options = [
  { value: '01', label: '1' },
  { value: '02', label: '2' },
  { value: '03', label: '3' },
  { value: '04', label: '4' },
  { value: '05', label: '5' },
  { value: '06', label: '6' },
  { value: '07', label: '7' },
  { value: '08', label: '8' },
  { value: '09', label: '9' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
  { value: '13', label: '13' },
  { value: '14', label: '14' },
  { value: '15', label: '15' },
  { value: '16', label: '16' },
  { value: '17', label: '17' },
  { value: '18', label: '18' },
  { value: '19', label: '19' },
  { value: '20', label: '20' },
  { value: '21', label: '21' },
  { value: '22', label: '22' },
  { value: '23', label: '23' },
  { value: '24', label: '24' },
  { value: '25', label: '25' },
  { value: '26', label: '26' },
  { value: '27', label: '27' },
  { value: '28', label: '28' },
  { value: '29', label: '29' },
  { value: '30', label: '30' },
  { value: '31', label: '31' }
];

const customStylesDefault = {
  container: provided => ({
    ...provided,
    width: `28.5%`,
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
    width: `28.5%`,
    margin: `0% 1.5% 0% 0%`,
  }),
  control: (provided) => ({
      ...provided,
      border: '1px solid #f05050'
  })
};

export default function DaySelector(props) {
    return (
      <Select
        placeholder={`Day`}
        styles={ !props.hasError ? customStylesDefault : customStylesError }
        options={options}
        value={options.find(o => o.value === props.defaultv)}
        onChange={(e) => {props.setDay(e.value)}}
        isDisabled={props.disabled}
      />
    )
}