import React from 'react';
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

function setOptions(pods, active) {
    if (!Array.isArray(pods)) return;
    options = pods.map(function (pod) {
        if (active === "required" && pod.active) {
            return { value: pod.id, label: pod.podName }
        }
    })
}

export default function PodSelector(props) {
    if (props.pods) setOptions(props.pods, props.active);

    React.useEffect(() => {
        if (props.defaultV && props.defaultCall) props.defaultCall(props.defaultV)
    }, [props.defaultV]);

    return (
        <Select
            placeholder="Select a Pod..."
            styles={!props.hasError ? customStylesDefault : customStylesError}
            options={options}
            defaultValue={props.defaultV ? { label: props.defaultV.podName, value: props.defaultV.id } : null}
            value={props.defaultV ? options.find(o => o.value === props.defaultV.id) : null}
            onChange={(e) => {
                if (!props.validate) {
                    props.setPod(e.value)
                    return
                }
                props.setPod(e.value)
                props.validate("pod")
            }}
            isDisabled={props.disabled}
        />
    )
}