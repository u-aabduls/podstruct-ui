import React from 'react';
import deactivatePod from "../../../connectors/PodDeactivate";
import { Progress, Card, CardHeader, CardBody, CardFooter, Table } from 'reactstrap';
import Swal from '../../Common/Swal';

function deactivate(podId) {
    var result = deactivatePod({ podId: podId });
    if (result.isSuccess) {
        window.location.href = window.location.href;
    }
}

const contentHeadingStyle = {
    paddingTop: `0.5rem`
}

const swalDeactivateOptions = {
    title: 'Are you sure?',
    text: 'You are about to deactivate this pod',
    icon: 'warning',
    buttons: {
        cancel: {
            text: 'No, cancel',
            value: null,
            visible: true,
            className: "",
            closeModal: false
        },
        confirm: {
            text: 'Yes, deactivate',
            value: true,
            visible: true,
            className: "bg-danger",
            closeModal: false
        }
    }
}

function swalCallback5(isConfirm, swal) {
    if (isConfirm) {
        swal("Deactivated", "Your pod has been deacivated.", "success");
    } else {
        swal("Cancelled", "Cancelled attempt to deactivate this pod.", "error");
    }
}

export default function PodsViewCard(props) {
    return (
        <Card className="b">
            <CardHeader>
                <div className="float-right">
                    <div className="badge badge-info">started</div>
                </div>
                <h4 className="m-0">{props.name}</h4>
            </CardHeader>
            <CardBody style={contentHeadingStyle}>
                <div className="d-flex align-items-center">
                    <div className="w-100" data-title="Health">
                        <Progress className="progress-xs m-0" value="22" color="warning" />
                    </div>
                    <div className="wd-xxs text-right">
                        <div className="text-bold text-muted">22%</div>
                    </div>
                </div>
            </CardBody>
            <Table>
                <tbody>
                    <tr>
                        <td>
                            <strong>Pod Description</strong>
                        </td>
                        <td>
                            {props.description.length > 50 ? props.description.substring(0,50) + "..." : props.description}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <strong>Start date</strong>
                        </td>
                        <td>
                            01/01/2016
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <strong>My Role</strong>
                        </td>
                        <td>
                            {props.role}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <strong>Number of Students</strong>
                        </td>
                        <td>
                            {props.studentCount}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <strong>Number of Courses</strong>
                        </td>
                        <td>
                            {props.courseCount}
                        </td>
                    </tr>
                </tbody>
            </Table>
            <CardFooter className="text-center">
                {props.action.length > 1 &&
                    <div>
                        <button 
                            className="btn btn-warning mr-2 mt-2 mb-2" 
                            title="Manage">
                                Manage
                        </button>
                        {/* <button 
                            className="btn btn-danger mt-2 mb-2" 
                            title="Deactivate"
                            onClick={e => {deactivate(props.id)}}>
                                Deactivate
                        </button> */}
                        <Swal options={swalDeactivateOptions} callback={swalCallback5} className="btn btn-danger">Deactivate</Swal>
                    </div> 
                }
                {props.action.length === 1 && props.action[0] === "Manage" &&
                    <div>
                        <button 
                            className="btn btn-warning m-2" 
                            title="Manage">
                                Manage
                        </button>
                    </div> 
                }
                {props.action.length === 1 && props.action[0] === "View" &&
                    <div>
                        <button 
                            className="btn btn-primary m-2" 
                            title="View">
                                View
                        </button>
                    </div> 
                }
            </CardFooter>
        </Card>
    )
}