import Select from 'react-select';

var options = [];

const customStylesDefault = {
    placeholder: (provided) => ({
        ...provided,
        color: "#b7bac9",
    })
}

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

function setOptions(pods) {
    options = pods.map(function (pod) {
        return { value: pod.id, label: pod.podName }
    })
}

export default function PodSelector(props) {
    setOptions(props.pods);
    return (
        <Select
            placeholder="Select a Pod..."
            styles={!props.hasError ? customStylesDefault : customStylesError}
            options={options}
            value={options.find(o => o.value === props.defaultv)}
            onChange={(e) => { props.setPod(e.value) }}
        />
    )
}