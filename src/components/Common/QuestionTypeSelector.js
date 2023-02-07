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

function setAdditionalOptions(assignmentType) {
    // only add the extra option if it doesnt already exist as an option
    if (assignmentType === 'FREE_FORM' && !options.find(o => o.value === 'FF')) options.push({ value: 'FF', label: 'Free Form' });
    else if (assignmentType !== 'FREE_FORM' && options.find(o => o.value === 'FF')) {
        options.splice(options.findIndex(o => o.value === 'FF'), 1)
    }
    if (assignmentType === 'ESSAY') return;
}

export default function QuestionTypeSelector(props) {
    setAdditionalOptions(props.assignmentType)
    return (
        <Select
            placeholder="Select a question type..."
            styles={!props.hasError ? customStylesDefault : customStylesError}
            options={options}
            value={options.find(o => o.value === props.defaultV)}
            onChange={(e) => props.setType(e.value)}
            isDisabled={props.disabled}
        />
    )
}