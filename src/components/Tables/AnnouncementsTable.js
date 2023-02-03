import React, { Component } from 'react';
import {
    Button,
    Table
} from 'reactstrap';
import moment from 'moment';
import Swal from 'sweetalert2';
import {
    getPodAnnouncements,
    getCourseAnnouncements,
    deletePodAnnouncement,
    deleteCourseAnnouncement
} from '../../connectors/Announcement';
import { isAdmin } from '../../utils/PermissionChecker';
import EditAnnouncementForm from '../Forms/Announcement/EditAnnouncementForm';
import { swalConfirm } from '../../utils/Styles';

class AnnouncementsTable extends Component {

    state = {
        rolePerms: this.props.role,
        pod: this.props.pod,
        course: this.props.course,
        announcements: [],
        lastEvaluatedKey: '',
        editAnnouncementModal: false,
        announcementToEdit: ''
    }

    fetchMore = () => {
        if (this.state.lastEvaluatedKey) {
            var stateCopy = this.state;
            var res = this.state.course ?
                getCourseAnnouncements(this.state.course.podId, this.state.course.id, this.state.lastEvaluatedKey, 0) :
                getPodAnnouncements(this.state.pod.id, this.state.lastEvaluatedKey, 0);
            if (res.isSuccess) {
                stateCopy.announcements = this.state.announcements.concat(res.data.announcements);
                stateCopy.lastEvaluatedKey = res.data.lastEvaluatedKey;
                this.setState(stateCopy);
            }
        }
    }

    toggleEditAnnouncementModal = (announcement) => {
        this.setState({
            editAnnouncementModal: !this.state.editAnnouncementModal,
            announcementToEdit: announcement
        });
    }

    updateOnAnnouncementEdit = (res) => {
        if (res.isSuccess) {
            this.setState({
                announcements: res.data.announcements,
                lastEvaluatedKey: res.data.lastEvaluatedKey
            });
        }
    }

    deleteAnnouncement = (date) => {
        Swal.fire({
            title: 'Are you sure you want to delete the announcement?',
            showCancelButton: true,
            confirmButtonColor: swalConfirm(),
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var stateCopy = this.state;
                var res = this.state.course ?
                    deleteCourseAnnouncement(this.state.course.podId, this.state.course.id, date) :
                    deletePodAnnouncement(this.state.pod.id, date);
                if (res.isSuccess) {
                    res = this.state.course ?
                        getCourseAnnouncements(this.state.course.podId, this.state.course.id, '', 0) :
                        getPodAnnouncements(this.state.pod.id, '', 0);
                    stateCopy.announcements = res.data.announcements;
                    stateCopy.lastEvaluatedKey = res.data.lastEvaluatedKey;
                    this.setState(stateCopy);
                }
                Swal.fire({
                    title: 'Successfully deleted announcement',
                    icon: 'success',
                    confirmButtonColor: swalConfirm()
                })
            }
        });
    }

    componentDidMount() {
        var stateCopy = this.state;
        var res = this.state.course ?
            getCourseAnnouncements(this.state.course.podId, this.state.course.id, this.state.lastEvaluatedKey, 0) :
            getPodAnnouncements(this.state.pod.id, this.state.lastEvaluatedKey, 0);
        if (res.isSuccess) {
            stateCopy.announcements = res.data.announcements;
            stateCopy.lastEvaluatedKey = res.data.lastEvaluatedKey;
            this.setState(stateCopy);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.announcements !== prevProps.announcements) {
            this.setState({ announcements: this.props.announcements });
        }
        if (this.props.lastEvaluatedKey !== prevProps.lastEvaluatedKey) {
            this.setState({ lastEvaluatedKey: this.props.lastEvaluatedKey });
        }
    }

    render() {
        var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return (
            <div>
                <Table hover responsive>
                    {this.state.announcements.length > 0 ?
                        this.state.announcements.map((announcement) => {
                            var date = new Date(announcement.date * 1000);
                            return (
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
                                            <Button
                                                className="btn btn-sm bg-danger"
                                                style={{float: 'right'}}
                                                onMouseDown={e => e.preventDefault()}
                                                onClick={() => { this.deleteAnnouncement(announcement.date) }}
                                            >
                                                <i className="fas fa-trash-alt fa-fw btn-icon"></i>
                                            </Button>
                                            : null
                                        }
                                        {isAdmin(this.state.rolePerms) ?
                                            <Button
                                                className="btn btn-sm bg-primary mr-1"
                                                style={{float: 'right'}}
                                                onMouseDown={e => e.preventDefault()}
                                                onClick={() => this.toggleEditAnnouncementModal(announcement)}
                                            >
                                                <i className="fas icon-pencil fa-fw btn-icon"></i>
                                            </Button>
                                            : null
                                        }
                                    </td>
                                </tr>
                            )
                        }
                        )
                        : <tr>
                            <h3 className='text-center pt-5 pb-4'>No Announcements</h3>
                        </tr>}
                </Table>
                <EditAnnouncementForm
                    pod={this.state.pod}
                    course={this.state.course}
                    modal={this.state.editAnnouncementModal}
                    announcement={this.state.announcementToEdit}
                    toggle={this.toggleEditAnnouncementModal}
                    updateOnEdit={this.updateOnAnnouncementEdit}
                />
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

export default AnnouncementsTable;