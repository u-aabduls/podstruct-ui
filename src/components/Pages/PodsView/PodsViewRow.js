import React from 'react';
import deactivatePod from "../../../connectors/PodDeactivate";

const customStylesDefault = {
    backgroundColor: ""
};

const customStylesColored = {
    backgroundColor: "#F2F3F5"
};

const actionColumnStyle = {
    textAlign: `center`
}

function deactivate(podId){
    var result = deactivatePod({podId: podId});
    if (result.isSuccess) {
        window.location.href = window.location.href;
    }
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
                        <button 
                            className="btn btn-secondary mr-2 mt-2 mb-2" 
                            title="Manage">
                                <em className="fa icon-pencil"></em>
                        </button>
                        <button 
                            className="btn btn-danger mt-2 mb-2" 
                            title="Deactivate"
                            onClick={e => {deactivate(props.id)}}>
                                <em className="fa fa-trash"></em>
                        </button>
                    </div> 
                }
                {props.action.length === 1 && props.action[0] === "Manage" &&
                    <div>
                        <button 
                            className="btn btn-secondary m-2" 
                            title="Manage">
                                <em className="fa icon-pencil"></em>
                        </button>
                    </div> 
                }
                {props.action.length === 1 && props.action[0] === "View" &&
                    <div>
                        <button 
                            className="btn btn-primary m-2" 
                            title="View">
                                <em className="fa fa-folder-open"></em>
                        </button>
                    </div> 
                }
            </td>
        </tr>
    )
}