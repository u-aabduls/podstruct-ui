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
      border: '1px solid #f05050 !important'
  })
};

export default function MonthSelector(props) {
    return (
      <Select
        placeholder={`Month`}
        styles={ !props.hasError ? customStylesDefault : customStylesError }
        options={options}
        onChange={(e) => {props.setMonth(e.value)}}
      />
    )
}