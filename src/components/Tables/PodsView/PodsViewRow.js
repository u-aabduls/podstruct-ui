import React from 'react';

const customStylesDefault = {
    backgroundColor: ""
};

const customStylesColored = {
    backgroundColor: "#F2F3F5"
};

export default function PodsViewRow(props) {
    return (
        <tr style={props.isOddRow ? customStylesColored : customStylesDefault}>
            <td>{props.name}</td>
            <td>{props.description}</td>
            <td>{props.role}</td>
            <td>{props.courseCount}</td>
            <td>{props.studentCount}</td>
            <td>{props.action}</td>
        </tr>
    )
}