import React from 'react';

const customStylesDefault = {
    backgroundColor: ""
};

const customStylesColored = {
    backgroundColor: "#F2F3F5"
};

const actionColumnStyle = {
    textAlign: `center`
}

export default function PodsViewRow(props) {
    return (
        <tr style={props.isOddRow ? customStylesColored : customStylesDefault}>
            <td>{props.name}</td>
            <td>{props.description}</td>
            <td>{props.role}</td>
            <td>{props.courseCount}</td>
            <td>{props.studentCount}</td>
            <td style={actionColumnStyle}>
                {props.action.length > 1 &&
                    <div>
                        <button className="btn btn-secondary mr-2 mt-2 mb-2" title="Manage">
                            <em className="fa icon-pencil"></em>
                        </button>
                        <button className="btn btn-danger mt-2 mb-2" size="sm" title="Deactivate">
                            <em className="fa fa-trash"></em>
                        </button>
                    </div> 
                }
                {props.action.length === 1 && props.action[0] === "Manage" &&
                    <div>
                        <button className="btn btn-secondary m-2" size="sm" title="Manage">
                            <em className="fa icon-pencil"></em>
                        </button>
                    </div> 
                }
                {props.action.length === 1 && props.action[0] === "View" &&
                    <div>
                        <button className="btn btn-primary m-2" size="sm" title="View">
                            <em className="fa fa-folder-open"></em>
                        </button>
                    </div> 
                }
            </td>
        </tr>
    )
}