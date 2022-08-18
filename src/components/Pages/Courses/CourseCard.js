import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Card, CardHeader, CardBody, Table } from 'reactstrap';
import moment from 'moment';

class CourseCard extends Component {

    detailRedirect = e => {
        this.props.history.push({pathname: "/course/details", state: {course: this.props.course}})
    }

    render() {
        var daysOfWeek = ["Mon", "Tues", "Wed", "Thrus", "Fri", "Sat", "Sun"]
        var output = ""
        return (
            <div onClick={this.detailRedirect}>
                <Card outline color="dark" className="b">
                    {/* <Link to={{ pathname: "/course/details", state: this.props.course }}> */}
                        <CardHeader className="course-card-header">
                            <h4 className="m-0 text-center">{this.props.course.subject}</h4>
                        </CardHeader>
                    {/* </Link> */}
                    <Table>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Teacher:</strong>
                                </td>
                                <td>

                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Course Schedule:</strong>
                                </td>
                                <td>
                                    {this.props.course.daysOfWeekInterval.split(',').forEach(function (i, idx, array) {
                                        if (idx === array.length - 1) {
                                            output += daysOfWeek[i - 1]
                                        }
                                        else {
                                            output += daysOfWeek[i - 1] + '/'
                                        }
                                    })}
                                    {output}
                                    <br></br>
                                    {moment(this.props.course.startTime, "HH:mm:ss").format("h:mm A") + " - " + moment(this.props.course.endTime, "HH:mm:ss").format("h:mm A")}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card >
            </div>
        )
    }
}

export default withRouter(CourseCard)