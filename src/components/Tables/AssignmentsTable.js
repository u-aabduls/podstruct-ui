import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
    Button,
    Table
} from 'reactstrap';
import moment from 'moment';
import { getAssignments, deleteAssignment, publishAssignment } from '../../connectors/Assignments';
import { isAdmin, isStudent } from '../../utils/PermissionChecker';
import Swal from 'sweetalert2';

class AssignmentsTable extends Component {

    state = {
        rolePerms: this.props.course.role,
        course: this.props.course,
        assignments: [],
        getAssignmentsParams: {
            page: 0,
            size: 10,
            sort: 'createDate,desc',
        },
    }

    nextPage = () => {
        if (this.state.assignments.length > this.state.getAssignmentsParams.size) {
            var stateCopy = this.state
            var params = this.state.getAssignmentsParams
            var res = getAssignments(this.state.course.podId, this.state.course.id, params.page + 1, params.size, params.sort)
            if (res.isSuccess) {
                stateCopy.assignments = res.data
                stateCopy.getAssignmentsParams.page = this.state.getAssignmentsParams.page + 1
                this.setState(stateCopy)
            }
        }
    }

    prevPage = () => {
        if (this.state.getAssignmentsParams.page) {
            var stateCopy = this.state
            var params = this.state.getAssignmentsParams
            var res = getAssignments(this.state.course.podId, this.state.course.id, params.page - 1, params.size, params.sort)
            if (res.isSuccess) {
                stateCopy.assignments = res.data
                stateCopy.getAssignmentsParams.page = this.state.getAssignmentsParams.page - 1
                this.setState(stateCopy)
            }
        }
    }

    publish = (assignmentId, assignmentTitle) => {
        Swal.fire({
            title: assignmentTitle + 'will be published and available to all users in this course',
            showCancelButton: true,
            confirmButtonColor: "#5d9cec",
            confirmButtonText: 'Ok',
        }).then((result) => {
            if (result.isConfirmed) {
                var stateCopy = this.state
                var res = publishAssignment(this.state.course.podId, this.state.course.id, assignmentId)
                if (res.isSuccess) {
                    Swal.fire({
                        title: "Successfully published assignment",
                        confirmButtonColor: "#5d9cec",
                        icon: "success",
                    })
                    var params = this.state.getAssignmentsParams
                    res = getAssignments(this.state.course.podId, this.state.course.id, params.page, params.size, params.sort)
                    if (res.isSuccess) {
                        stateCopy.assignments = res.data
                        this.setState(stateCopy)
                    }
                }

            }
        })
    }

    deleteAssignments = (assignmentId) => {
        Swal.fire({
            title: 'Are you sure you want to delete the assignment?',
            showCancelButton: true,
            confirmButtonColor: "#5d9cec",
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var stateCopy = this.state
                var res = deleteAssignment(this.state.course.podId, this.state.course.id, assignmentId)
                var params = this.state.getAssignmentsParams
                res = getAssignments(this.state.course.podId, this.state.course.id, params.page, params.size, params.sort)
                if (res.isSuccess) {
                    stateCopy.assignments = res.data
                    this.setState(stateCopy)
                }
                Swal.fire('Successfully deleted assignment', '', 'success')
            }
        })
    }

    assignmentDetailRedirect = (event, assignmentId) => {
        if (event.target.id === 'button') return;
        this.props.history.push(`/course/assignment/details/${assignmentId}`, { podID: this.state.course.podId, course: this.state.course, rolePerms: this.state.rolePerms })
    }

    componentDidMount() {
        var stateCopy = this.state
        var params = this.state.getAssignmentsParams
        var res = getAssignments(this.state.course.podId, this.state.course.id, params.page, params.size, params.sort)
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
                                Date Assigned
                            </th>
                            <th>
                                Assignment Title
                            </th>
                            <th>
                                Due Date/Time
                            </th>
                            <th>
                                Status
                            </th>
                        </tr>
                    </thead>
                    {this.state.assignments.length > 0 ?
                        this.state.assignments.map((assignment) => {
                            if (!assignment.published && isStudent(this.state.rolePerms)) return
                            var dueDate = new Date(moment.utc(assignment.dueDateTime).local().format('YYYY-MM-DD HH:mm:ss'));
                            if (assignment.publishDateTime) var publishDate = new Date(moment.utc(assignment.publishDateTime).local().format('YYYY-MM-DD HH:mm:ss'));
                            return (
                                <tbody onClick={(event) => this.assignmentDetailRedirect(event, assignment.id)}>
                                    <tr>
                                        {assignment.publishDateTime ? <td>
                                            <span className="text-uppercase text-bold">
                                                {days[publishDate.getDay()]}
                                                {' '}
                                                {months[publishDate.getMonth()]}
                                                {' '}
                                                {publishDate.getDate()}
                                            </span>
                                            <br />
                                            <span className="h2 mt0 text-sm">
                                                {moment(publishDate).format("h:mm A")}
                                            </span>
                                        </td>
                                            : <td></td>}
                                        <td>
                                            {assignment.title}
                                        </td>
                                        <td>
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
                                                !assignment.published ?
                                                    <div className='button-container'>
                                                        <button className="btn btn-success btn-sm" id='button' onClick={() => this.publish(assignment.id, assignment.title)}>
                                                            <i className="fa fa-cloud fa-sm button-create-icon"></i>
                                                            Publish
                                                        </button>
                                                    </div>
                                                    : <div className='button-container'>
                                                        <button disabled className="btn btn-success btn-sm" id='button'>
                                                            <i className="fa fa-cloud fa-sm button-create-icon"></i>
                                                            Publish
                                                        </button>
                                                    </div>
                                                : null
                                            }
                                        </td>
                                        <td className="buttons">
                                            {isAdmin(this.state.rolePerms) ?
                                                <div className='button-container'>
                                                    <Button className="btn btn-secondary btn-sm bg-danger" onClick={() => this.deleteAssignments(assignment.id)}>
                                                        <i className="fas fa-trash-alt fa-fw btn-icon" id='button'></i>
                                                    </Button>
                                                </div>
                                                : null
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        })
                        : <tr>
                            <td colspan="4" className='text-center pt-5 pb-4'>
                                <h3>No Assignments</h3>
                            </td>
                        </tr>}
                </Table>
                <div>
                    <Button color="secondary" className="btn float-right mt-3 mb-5" size="sm" onClick={this.nextPage}>
                        <span><i className="fa fa-chevron-right"></i></span>
                    </Button>
                    <Button color="secondary" className="btn float-right mt-3 mb-5" size="sm" onClick={this.prevPage}>
                        <span><i className="fa fa-chevron-left"></i></span>
                    </Button>
                </div>
            </div>
        )
    }
}

export default withRouter(AssignmentsTable)