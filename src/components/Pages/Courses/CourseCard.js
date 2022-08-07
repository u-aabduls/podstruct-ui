import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Table } from 'reactstrap';
import moment from 'moment';

class CourseCard extends Component {

    render() {
        var daysOfWeek = ["Mon", "Tues", "Wed", "Thrus", "Fri", "Sat", "Sun"]
        var output = ""
        return (
            <Card outline color="dark" className="b">
                <CardHeader className="course-card-header">
                    <h4 className="m-0 text-center">{this.props.subject}</h4>
                </CardHeader>
                <CardBody>

                </CardBody>
                <Table>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Course ID:</strong>
                            </td>
                            <td>
                                {this.props.id}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Course Description:</strong>
                            </td>
                            <td>
                                {this.props.description}
                            </td>
                        </tr>
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
                                {this.props.daysOfWeekInterval.split(',').forEach(function (i, idx, array) {
                                    if (idx === array.length - 1) {
                                        output += daysOfWeek[i - 1]
                                    }
                                    else {
                                        output += daysOfWeek[i - 1] + '/'
                                    }
                                })}
                                {output}
                                <br></br>
                                {moment(this.props.startTime, "HH:mm:ss").format("h:mm ") + " - " + moment(this.props.endTime, "HH:mm:ss").format("h:mm A")}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        )
    }
}

export default CourseCard