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

function setOptions(pods) {
    if(!Array.isArray(pods)) return;
    options = pods.map(function (pod) {
        return { value: pod.id, label: pod.podName }
    })
}

export default function PodSelector(props) {
    if(props.pods) setOptions(props.pods);
    return (
        <Select
            placeholder="Select a Pod..."
            styles={!props.hasError ? customStylesDefault : customStylesError}
            options={options}
            defaultValue={props.defaultV? { label: props.defaultV.podName, value: props.defaultV.id } : null}
            value={options.find(o => o.value === props.defaultv)}
            onChange={(e) => { props.setPod(e.value) }}
            isDisabled={props.disabled}
        />
    )
}