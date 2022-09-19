import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import {
    Button,
    Dropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Row,
    Card,
    CardBody,
    Col,
    TabContent,
    TabPane,
    Table,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import { getCourseAnnouncements, deleteCourseAnnouncement } from '../../../connectors/Announcement';
import EditCourseForm from '../../Forms/Course/EditCourseForm';
import AddAnnouncementForm from '../../Forms/Announcement/AddAnnouncementForm';

class CourseDetail extends Component {

    state = {
        privileges: "owner",
        course: this.props.location.state,
        announcements: [],
        lastEvaluatedKey: '',
        editModal: false,
        annModal: false,
        ddOpen: false,
        activeTab: '1',
    }

    toggleDD = () => this.setState({
        ddOpen: !this.state.ddOpen
    })

    toggleEditModal = () => {
        this.setState({
            editModal: !this.state.editModal
        });
    }

    toggleAnnModal = () => {
        this.setState({
            annModal: !this.state.annModal
        });
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    updateOnCourseEdit = (res) => {
        if (res.isSuccess) {
            this.setState({
                course: res.data
            })
        }
    }

    updateOnAnnouncementAdd = (res) => {
        if (res.isSuccess) {
            this.setState({
                announcements: res.data.announcements,
                lastEvaluatedKey: res.data.lastEvaluatedKey
            })
        }
    }

    fetchMore = () => {
        if (this.state.lastEvaluatedKey) {
            var stateCopy = this.state
            var res = getCourseAnnouncements(this.state.course.podId, this.state.course.id, this.state.lastEvaluatedKey, 0)
            if (res.isSuccess && !res.data.announcements.length == 0) {
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

    render() {
        var days = ["Sun", "Mon", "Tues", "Wed", "Thrus", "Fri", "Sat"];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var output = "";
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Course Details
                        <small>Check out the details and edit a specific course</small>
                    </div>

                    <div className="ml-auto">
                        <Dropdown isOpen={this.state.ddOpen} toggle={this.toggleDD}>
                            <DropdownToggle>
                                <em className="fas fa-ellipsis-v fa-lg"></em>
                            </DropdownToggle>
                            <DropdownMenu>
                                {this.state.privileges === "owner" &&
                                    <DropdownItem onClick={this.toggleEditModal}>Edit Course</DropdownItem>
                                }
                            </DropdownMenu>
                        </Dropdown>
                        <EditCourseForm
                            course={this.state.course}
                            modal={this.state.editModal}
                            toggle={this.toggleEditModal}
                            updateOnEdit={this.updateOnCourseEdit}
                        />
                    </div>
                </div>
                <Row noGutters={true}>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body">
                                <h4 className="mt-1 text-muted">Course Subject</h4>
                                <p className="text-primary font-weight-bold">{this.state.course.subject}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body">
                                <h4 className="mt-1 text-muted">Course Description</h4>
                                <p className="text-primary font-weight-bold">{this.state.course.description}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body">
                                <h4 className="mt-1 text-muted">Teacher</h4>
                                <p className="text-primary font-weight-bold"></p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body">
                                <h4 className="mt-1 text-muted">Course Schedule</h4>
                                <p className="text-primary font-weight-bold">{this.state.course.daysOfWeekInterval.split(',').forEach(function (i, idx, array) {
                                    if (idx === array.length - 1) {
                                        output += days[i]
                                    }
                                    else {
                                        output += days[i] + '/'
                                    }
                                })}
                                    {output}
                                    <br></br>
                                    {moment(this.state.course.startTime, "HH:mm:ss").format("h:mm A") + " - " + moment(this.state.course.endTime, "HH:mm:ss").format("h:mm A")}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md={12}>
                        <Card className="card">
                            <CardBody>
                                <div role="tabpanel">
                                    {/* Nav tabs */}
                                    <Nav tabs>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === '1' })}
                                                onClick={() => { this.toggleTab('1'); }}>
                                                Announcements
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === '2' })}
                                                onClick={() => { this.toggleTab('2'); }}>
                                                Assignments
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === '3' })}
                                                onClick={() => { this.toggleTab('3'); }}>
                                                Upcoming Events
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    {/* Tab panes */}
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="1">
                                            {this.state.privileges === "owner" &&
                                                <div className="float-right">
                                                    <Button className="btn btn-secondary btn-sm mb-3 mt-2" onClick={this.toggleAnnModal}>Add Announcement</Button>
                                                </div>
                                            }
                                            <AddAnnouncementForm
                                                course={this.state.course}
                                                modal={this.state.annModal}
                                                updateOnAdd={this.updateOnAnnouncementAdd}
                                                toggle={this.toggleAnnModal}
                                            />
                                            <Table hover responsive>
                                                {this.state.announcements.length > 0 &&
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
                                                                        {this.state.privileges === "owner" &&
                                                                            <div className='button-container'>
                                                                                <Button className="btn btn-secondary btn-sm bg-danger" onClick={() => this.deleteAnnouncement(announcement.date)}>
                                                                                    <i className="fas fa-trash-alt fa-fw btn-icon"></i>
                                                                                </Button>
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        )
                                                    }
                                                    )
                                                }
                                            </Table>
                                            {typeof this.state.lastEvaluatedKey !== 'undefined' &&
                                                <div>
                                                    <Button className="btn btn-secondary btn-sm" style={{ marginLeft: "50%" }} onClick={this.fetchMore}>See More</Button>
                                                </div>
                                            }
                                        </TabPane>
                                        <TabPane tabId="2">Integer lobortis commodo auctor.</TabPane>
                                        <TabPane tabId="3">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</TabPane>
                                        <TabPane tabId="4">Sed commodo tellus ut mi tristique pharetra.</TabPane>
                                    </TabContent>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </ContentWrapper >
        )
    }
}

export default withRouter(CourseDetail)