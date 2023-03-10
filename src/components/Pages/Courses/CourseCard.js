import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Card, CardHeader, Table } from 'reactstrap';
import moment from 'moment';

class CourseCard extends Component {

    render() {
        var daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
        var output = ""
        return (
            <div className='course-preview'>
                <Link to={{ pathname: `/course/details/${this.props.course.podId}/${this.props.course.id}`, state: {course: this.props.course, from: 'Courses'}}}>
                    <Card outline color="dark" className="b">
                        <CardHeader className="theme-card-header">
                            <h4 className="m-0 text-center">{this.props.course.subject}</h4>
                        </CardHeader>
                        <Table>
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Description:</strong>
                                    </td>
                                    <td style={{ overflowY: 'auto', overflowX: 'hidden', overflowWrap: 'anywhere' }}>
                                        {this.props.course.description ?
                                            this.props.course.description.length >= 65 ?
                                                this.props.course.description.substring(0, 60) + "..."
                                                : this.props.course.description
                                            : null}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Course Schedule:</strong>
                                    </td>
                                    <td>
                                        {this.props.course.daysOfWeekInterval.split(',').forEach(function (i, idx, array) {
                                            if (idx === array.length - 1) {
                                                output += daysOfWeek[i]
                                            }
                                            else {
                                                output += daysOfWeek[i] + '/'
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
                </Link>
            </div>
        )
    }
}

export default withRouter(CourseCard)