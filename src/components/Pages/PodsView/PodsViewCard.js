import React from 'react';
import deactivatePod from "../../../connectors/PodDeactivate";
import { Progress, Card, CardHeader, CardBody, CardFooter, Table } from 'reactstrap';
import Sparkline from '../../Common/Sparklines';

function deactivate(podId) {
    var result = deactivatePod({ podId: podId });
    if (result.isSuccess) {
        window.location.href = window.location.href;
    }
}

const contentHeadingStyle = {
    paddingTop: `0.5rem`
}

export default function PodsViewCard(props) {
    return (
        <Card className="b">
            <CardHeader>
                <div className="float-right">
                    <div className="badge badge-info">started</div>
                </div>
                <h4 className="m-0">{props.name}</h4>
                {/* <small className="text-muted">Sed amet lectus id.</small> */}
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
                            {props.description}
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
                                {/* <em className="fa icon-pencil"></em> */}
                                Manage
                        </button>
                        <button 
                            className="btn btn-danger mt-2 mb-2" 
                            title="Deactivate"
                            onClick={e => {deactivate(props.id)}}>
                                {/* <em className="fa fa-trash"></em> */}
                                Deactivate
                        </button>
                    </div> 
                }
                {props.action.length === 1 && props.action[0] === "Manage" &&
                    <div>
                        <button 
                            className="btn btn-warning m-2" 
                            title="Manage">
                                {/* <em className="fa icon-pencil"></em> */}
                                Manage
                        </button>
                    </div> 
                }
                {props.action.length === 1 && props.action[0] === "View" &&
                    <div>
                        <button 
                            className="btn btn-primary m-2" 
                            title="View">
                                {/* <em className="fa fa-folder-open"></em> */}
                                View
                        </button>
                    </div> 
                }
            </CardFooter>
        </Card>
    )
}