import Select from 'react-select';

var options = [];

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

function setOptions(teachers) {
    if (!Array.isArray(teachers)) return;
    options = teachers.map(function (teacher) {
        return { value: teacher.username, label: teacher.firstName + " " + teacher.lastName }
    })
}

export default function TeacherSelector(props) {
    if (props.teachers) setOptions(props.teachers);
    return (
        <Select
            placeholder="Select a Teacher..."
            styles={!props.hasError ? customStylesDefault : customStylesError}
            options={options}
            defaultValue={props.defaultV ? { label: props.defaultV.podName, value: props.defaultV.id } : null}
            value={options.find(o => o.value === props.defaultv)}
            onChange={(e) => { 
                if (!props.validate) {
                    props.setTeacher(e.value) 
                    return
                }
                props.setTeacher(e.value) 
                props.validate("teacher") }}
            isDisabled={props.disabled}
        />
    )
}