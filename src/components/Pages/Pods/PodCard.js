import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import deactivatePod from "../../../connectors/PodDeactivate";
import { Card, CardHeader, CardBody, CardFooter, Table } from 'reactstrap';

class PodCard extends Component {

    deactivate = podId => {
        var result = deactivatePod({ podId: podId });
        if (result.isSuccess) {
            window.location.href = window.location.href;
        }
    }

    cardStyle = {
        textDecoration: `none`
    }
    
    contentHeadingStyle = {
        padding: `1rem`,
        color: `white`,
        backgroundColor: `#1797be`
    }
    
    contentBodyStyle = {
        padding: `0rem`
    }
    
    tableDataStyle = {
        paddingLeft: `1rem`
    }

    render() {
        return (
            <Link to="/notfound" style={this.cardStyle}>
                <Card className="b">
                    <CardHeader style={this.contentHeadingStyle}>
                        {/* <div className="float-right">
                        <div className="badge badge-info">started</div>
                    </div> */}
                        <h4 className="m-0">{this.props.name}</h4>
                    </CardHeader>
                    <CardBody style={this.contentBodyStyle}>
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
                                <td style={this.tableDataStyle}>
                                    <strong>My Role</strong>
                                </td>
                                <td>
                                    {this.props.role}
                                </td>
                            </tr>
                            <tr>
                                <td style={this.tableDataStyle}>
                                    <strong>Number of Students</strong>
                                </td>
                                <td>
                                    {this.props.studentCount}
                                </td>
                            </tr>
                            <tr>
                                <td style={this.tableDataStyle}>
                                    <strong>Number of Courses</strong>
                                </td>
                                <td>
                                    {this.props.courseCount}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    {/* <CardFooter className="text-center">
                        {this.props.action.length > 1 &&
                            <div>
                                <button
                                    className="btn btn-warning mr-2 mt-2 mb-2"
                                    title="Manage">
                                    Manage
                                </button>
                                <button
                                    className="btn btn-danger mt-2 mb-2"
                                    title="Deactivate"
                                    onClick={e => { this.deactivate(this.props.id) }}>
                                    Deactivate
                                </button>
                            </div>
                        }
                        {this.props.action.length === 1 && this.props.action[0] === "Manage" &&
                            <div>
                                <button
                                    className="btn btn-warning m-2"
                                    title="Manage">
                                    Manage
                                </button>
                            </div>
                        }
                        {this.props.action.length === 1 && this.props.action[0] === "View" &&
                            <div>
                                <button
                                    className="btn btn-primary m-2"
                                    title="View">
                                    View
                                </button>
                            </div>
                        }
                    </CardFooter> */}
                </Card>
            </Link>
        )
    }
}

export default withRouter(PodCard);