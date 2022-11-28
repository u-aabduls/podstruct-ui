import React, { Component } from 'react';
import {
    Button,
    Table
} from 'reactstrap';
import moment from 'moment';
import { getCourseAnnouncements, deleteCourseAnnouncement } from '../../connectors/Announcement';
import { isAdmin } from '../../utils/PermissionChecker';


class CourseAnnouncementsTable extends Component {

    state = {
        rolePerms: this.props.course.role,
        course: this.props.course,
        announcements: [],
        lastEvaluatedKey: '',
    }

    fetchMore = () => {
        if (this.state.lastEvaluatedKey) {
            var stateCopy = this.state
            var res = getCourseAnnouncements(this.state.course.podId, this.state.course.id, this.state.lastEvaluatedKey, 0)
            if (res.isSuccess) {
                stateCopy.announcements = this.state.announcements.concat(res.data.announcements)
                stateCopy.lastEvaluatedKey = res.data.lastEvaluatedKey
                this.setState(stateCopy)
            }
        }
    }

    deleteAnnouncement = (date) => {
        var stateCopy = this.state
        var res = deleteCourseAnnouncement(this.state.course.podId, this.state.course.id, date)
        if (res.isSuccess) {
            res = getCourseAnnouncements(this.state.course.podId, this.state.course.id, '', 0)
            stateCopy.announcements = res.data.announcements
            stateCopy.lastEvaluatedKey = res.data.lastEvaluatedKey
            this.setState(stateCopy)
        }
    }

    componentDidMount() {
        var stateCopy = this.state
        var res = getCourseAnnouncements(this.state.course.podId, this.state.course.id, this.state.lastEvaluatedKey, 0)
        if (res.isSuccess) {
            stateCopy.announcements = res.data.announcements
            stateCopy.lastEvaluatedKey = res.data.lastEvaluatedKey
            this.setState(stateCopy)
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.announcements !== prevProps.announcements) {
            this.setState({ announcements: this.props.announcements })
        }
        if (this.props.lastEvaluatedKey !== prevProps.lastEvaluatedKey) {
            this.setState({ lastEvaluatedKey: this.props.lastEvaluatedKey })
        }
    }

    render() {
        var days = ["Sun", "Mon", "Tues", "Wed", "Thrus", "Fri", "Sat"];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return (
            <div>
                <Table hover responsive>
                    {this.state.announcements.length > 0 ?
                        this.state.announcements.map((announcement) => {
                            var date = new Date(announcement.date * 1000);
                            return (
                                <tbody>
                                    <tr>
                                        <td className='date'>
                                            <span className="text-uppercase text-bold">
                                                {days[date.getDay()]}
                                                {' '}
                                                {months[date.getMonth()]}
                                                {' '}
                                                {date.getDate()}
                                            </span>
                                            <br />
                                            <span className="h2 mt0 text-sm">
                                                {moment(date).format("h:mm A")}
                                            </span>
                                        </td>
                                        <td className="announcement">
                                            <span className="h4 text-bold">{announcement.title}</span>
                                            <br />
                                            <span>{announcement.message}</span>
                                        </td>
                                        <td className="buttons">
                                            {isAdmin(this.state.rolePerms) ?
                                                <div className='button-container'>
                                                    <Button className="btn btn-secondary btn-sm bg-danger" onClick={() => this.deleteAnnouncement(announcement.date)}>
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
                            <h3 className='text-center pt-5 pb-4'>No Announcements</h3>
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

export default CourseAnnouncementsTable