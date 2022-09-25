import Select from 'react-select';

const options = [
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thrusday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
    { value: '7', label: 'Sunday' },
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

export default function DaysOfWeekSelector(props) {
    return (
        <Select
            placeholder="Select days of the week"
            isMulti={true}
            styles={!props.hasError ? customStylesDefault : customStylesError}
            options={options}
            value={props.defaultv ? props.defaultv.map(e => options.find(o => o.value === e)) : options.find(o => o.value === props.defaultv)}
            onChange={(e) => {
                props.setDays(e)
                props.validate("day")}}
        />
    )
}