import Select from 'react-select';

const options = [
    { value: 'MC', label: 'Multiple Choice' },
    { value: 'MA', label: 'Multiple Answers' },
    { value: 'TF', label: 'True/False' },
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

export default function QuestionTypeSelector(props) {
    return (
        <Select
            placeholder="Select a question type..."
            styles={!props.hasError ? customStylesDefault : customStylesError}
            options={options}
            value={props.defaultV ? options.find(o => o.value === props.defaultV) : { value: 'MC', label: 'Multiple Choice' }}
            onChange={(e) => props.setType(e.value)}
            isDisabled={props.disabled}
        />
    )
}