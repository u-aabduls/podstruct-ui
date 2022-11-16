import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { deactivatePod } from "../../../connectors/Pod";
import { Card, CardHeader, CardBody, Table } from 'reactstrap';

class PodCard extends Component {

    state = {
        pod: ''
    }

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

    componentDidMount() {
        this.setState({pod: this.props.pod})
    }

    componentDidUpdate(prevProps) {
        if (this.props.pod !== prevProps.pod) {
            this.setState({ pod: this.props.pod })
        }
    }

    render() {
        return (
            <div className='course-preview'>
                <Link to={{ pathname: `/pod/details/${this.state.pod.id}`, state: this.state.pod }}>
                    <Card outline color="dark" className="b">
                        <CardHeader className="theme-card-header">
                            <h4 className="m-0 text-center">{this.state.pod.podName}</h4>
                        </CardHeader>
                        <Table>
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>My Role:</strong>
                                    </td>
                                    <td>
                                        {this.state.pod.roleInPod}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Number of Students</strong>
                                    </td>
                                    <td>
                                        {this.state.pod.numberOfStudents}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Number of Courses</strong>
                                    </td>
                                    <td>
                                        {this.state.pod.numberOfTeachers}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card >
                </Link>
            </div>
            /* <CardFooter className="text-center">
                {this.state.action.length > 1 &&
                    <div>
                        <button
                            className="btn btn-warning mr-2 mt-2 mb-2"
                            title="Manage">
                            Manage
                        </button>
                        <button
                            className="btn btn-danger mt-2 mb-2"
                            title="Deactivate"
                            onClick={e => { this.deactivate(this.state.id) }}>
                            Deactivate
                        </button>
                    </div>
                }
                {this.state.action.length === 1 && this.state.action[0] === "Manage" &&
                    <div>
                        <button
                            className="btn btn-warning m-2"
                            title="Manage">
                            Manage
                        </button>
                    </div>
                }
                {this.state.action.length === 1 && this.state.action[0] === "View" &&
                    <div>
                        <button
                            className="btn btn-primary m-2"
                            title="View">
                            View
                        </button>
                    </div>
                }
            </CardFooter> */
        )
    }
}

export default withRouter(PodCard);