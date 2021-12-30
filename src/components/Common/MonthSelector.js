import React from 'react'
import Select from 'react-select'

const options = [
  { value: '0', label: 'Jan' },
  { value: '1', label: 'Feb' },
  { value: '2', label: 'Mar' },
  { value: '3', label: 'Apr' },
  { value: '4', label: 'May' },
  { value: '5', label: 'Jun' },
  { value: '6', label: 'Jul' },
  { value: '7', label: 'Aug' },
  { value: '8', label: 'Sept' },
  { value: '9', label: 'Oct' },
  { value: '10', label: 'Nov' },
  { value: '11', label: 'Dec' }
];

const customStyles = {
  container: provided => ({
    ...provided,
    width: `40%`
  })
};

export default function MonthSelector() {
    return (
      <Select
        placeholder={`Month`}
        styles={customStyles}
        options={options} 
      />
    )
}