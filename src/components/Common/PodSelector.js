import React from 'react';
import Select from 'react-select';

var options = [],
    modifiers = null;

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
    options = [];
    pods.forEach(function (pod) {
        if (active === "required" && pod.active) {
            options.push({ value: pod.id, label: pod.podName });
        }
    })
}

export default function PodSelector(props) {
    if (props.pods) setOptions(props.pods, props.active);

    modifiers = props;

    React.useEffect(() => {
        modifiers.defaultCall(modifiers.defaultV)
    }, [props.defaultV]);

    return (
        <Select
            placeholder="Select a Pod..."
            styles={!props.hasError ? customStylesDefault : customStylesError}
            options={options}
            value={props.defaultV ? { value: props.defaultV.id, label: props.defaultV.podName } : options.find(o => o.value === props.defaultV)}
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