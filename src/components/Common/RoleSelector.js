import Select from 'react-select';

const options = [
    { value: 'TEACHER', label: 'Teacher' },
    { value: 'STUDENT', label: 'Student' },
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

export default function RoleSelector(props) {
    return (
        <Select
            placeholder="Select a Role..."
            styles={!props.hasError ? customStylesDefault : customStylesError}
            options={options}
            defaultValue={props.defaultV ? { label: props.defaultV.role, value: props.defaultV.role } : null}
            value={options.find(o => o.value === props.defaultv)}
            onChange={(e) => { props.setRole(e.value) }}
            isDisabled={props.disabled}
        />
    )
}