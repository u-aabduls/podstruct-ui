import Select from 'react-select';

const options = [
    { value: 'ESSAY', label: 'General' },
    { value: 'FREE_FORM', label: 'Free Form' },
    { value: 'QUIZ', label: 'Quiz' },
    { value: 'TEST', label: 'Test' },
  ];

const customStylesDefault = {
    placeholder: (provided) => ({
        ...provided,
        color: "#b7bac9",
    })
}

const customStylesError = {
    control: (provided) => ({
        ...provided,
        border: '1px solid #f05050'
    })
};

export default function AssignmentTypeSelector(props) {
    return (
        <Select
            placeholder="Select an assignment type..."
            styles={!props.hasError ? customStylesDefault : customStylesError}
            options={options}
            value={options.find(o => o.value === props.defaultv)}
            onChange={(e) => { 
                props.setType(e.value)
                props.validate("type") }}
            isDisabled={props.disabled}
        />
    )
}