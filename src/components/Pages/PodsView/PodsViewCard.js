import React from 'react';
import { Link } from 'react-router-dom';
import deactivatePod from "../../../connectors/PodDeactivate";
import { Card, CardHeader, CardBody, CardFooter, Table } from 'reactstrap';

function deactivate(podId) {
    var result = deactivatePod({ podId: podId });
    if (result.isSuccess) {
        window.location.href = window.location.href;
    }
}

const cardStyle = {
    textDecoration: `none`
}

const contentHeadingStyle = {
    padding: `1rem`,
    color: `white`,
    backgroundColor: `#1797be`
}

const contentBodyStyle = {
    padding: `0rem`
}

const tableDataStyle = {
    paddingLeft: `1rem`
}

export default function PodsViewCard(props) {
    return (
        <Link to="/notfound" style={cardStyle}>
            <Card className="b">
                <CardHeader style={contentHeadingStyle}>
                    {/* <div className="float-right">
                    <div className="badge badge-info">started</div>
                </div> */}
                    <h4 className="m-0">{props.name}</h4>
                </CardHeader>
                <CardBody style={contentBodyStyle}>
                    <div className="d-flex align-items-center">
                        {/* <div className="w-100" data-title="Health">
                        <Progress className="progress-xs m-0" value="22" color="warning" />
                    </div> */}
                        {/* <div className="wd-xxs text-right">
                        <div className="text-bold text-muted">22%</div>
                    </div> */}
                    </div>
                </CardBody>
                <Table>
                    <tbody>
                        <tr>
                            <td style={tableDataStyle}>
                                <strong>My Role</strong>
                            </td>
                            <td>
                                {props.role}
                            </td>
                        </tr>
                        <tr>
                            <td style={tableDataStyle}>
                                <strong>Number of Students</strong>
                            </td>
                            <td>
                                {props.studentCount}
                            </td>
                        </tr>
                        <tr>
                            <td style={tableDataStyle}>
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
                            <button
                                className="btn btn-danger mt-2 mb-2"
                                title="Deactivate"
                                onClick={e => { deactivate(props.id) }}>
                                Deactivate
                            </button>
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
        </Link>
    )
}