import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
    Button,
    Table
} from 'reactstrap';
import moment from 'moment';
import { getAssignments } from '../../connectors/Assignments';
import { isAdmin } from '../../utils/PermissionChecker';


class AssignmentsTable extends Component {

    state = {
        rolePerms: this.props.course.role,
        course: this.props.course,
        assignments: [],
        lastEvaluatedKey: '',
    }

    fetchMore = () => {
        // if (this.state.lastEvaluatedKey) {
        //     var stateCopy = this.state
        //     var res = getCourseAnnouncements(this.state.course.podId, this.state.course.id, this.state.lastEvaluatedKey, 0)
        //     if (res.isSuccess) {
        //         stateCopy.announcements = this.state.announcements.concat(res.data.announcements)
        //         stateCopy.lastEvaluatedKey = res.data.lastEvaluatedKey
        //         this.setState(stateCopy)
        //     }
        // }
    }

    deleteAssignments = (date) => {

    }

    assignmentDetailRedirect = (assignmentId) => {
        this.props.history.push(`/course/assignment/details/${assignmentId}`, { podID:  this.state.course.podId, courseID: this.state.course.id, assignmentID: assignmentId})
    }

    componentDidMount() {
        var stateCopy = this.state
        var res = getAssignments(this.state.course.podId, this.state.course.id, 10)
        if (res.isSuccess) {
            stateCopy.assignments = res.data
            this.setState(stateCopy)
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.assignments !== prevProps.assignments) {
            this.setState({ assignments: this.props.assignments })
        }
    }

    render() {
        var days = ["Sun", "Mon", "Tues", "Wed", "Thrus", "Fri", "Sat"];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return (
            <div>
                <Table hover responsive>
                    <thead>
                        <tr>
                            <th>
                                Date of Issue
                            </th>
                            <th>
                                Assignment Title
                            </th>
                            <th>
                                Due Date
                            </th>
                            <th>
                                Status
                            </th>
                        </tr>
                    </thead>
                    {this.state.assignments.length > 0 ?
                        this.state.assignments.map((assignment) => {
                            var dueDate = new Date(assignment.dueDateTime);
                            return (
                                <tbody onClick={() => this.assignmentDetailRedirect(assignment.id)}>
                                    <tr>
                                        <td>

                                        </td>
                                        <td>
                                            {assignment.title}
                                        </td>
                                        <td >
                                            <span className="text-uppercase text-bold">
                                                {days[dueDate.getDay()]}
                                                {' '}
                                                {months[dueDate.getMonth()]}
                                                {' '}
                                                {dueDate.getDate()}
                                            </span>
                                            <br />
                                            <span className="h2 mt0 text-sm">
                                                {moment(dueDate).format("h:mm A")}
                                            </span>
                                        </td>
                                        <td>
                                            {assignment.published ? <span>Published</span> : <span>Unpublished</span>}
                                        </td>
                                        <td className="buttons">
                                            {isAdmin(this.state.rolePerms) ?
                                                <div className='button-container'>
                                                    <Button className="btn btn-secondary btn-sm bg-danger" onClick={() => this.deleteAnnouncement(assignment.date)}>
                                                        <i className="fas fa-trash-alt fa-fw btn-icon"></i>
                                                    </Button>
                                                </div>
                                                : null
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        }
                        )
                        : <tr>
                            <td colspan="4" className='text-center pt-5 pb-4'>
                                <h3>No Assignments</h3>
                            </td>
                        </tr>}
                </Table>
                {this.state.lastEvaluatedKey ?
                    <div>
                        <Button className="btn btn-secondary btn-sm" style={{ marginLeft: "50%" }} onClick={this.fetchMore}>See More</Button>
                    </div>
                    : null
                }
            </div>
        )
    }
}

export default withRouter(AssignmentsTable)