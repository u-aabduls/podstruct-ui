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
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import EditCourseForm from '../../Forms/Course/EditCourseForm';
import AddAnnouncementForm from '../../Forms/Announcement/AddAnnouncementForm';
import AddAssignmentForm from '../../Forms/Assignment/AddAssignmentForm';
import CourseAnnouncementsTable from '../../Tables/CourseAnnouncementsTable';
import AssignmentsTable from '../../Tables/AssignmentsTable';
import { getCourse } from '../../../connectors/Course';
import { getPod } from '../../../connectors/Pod';
import { isAdmin, isStudent } from '../../../utils/PermissionChecker';
import DocumentsTable from '../../Tables/DocumentsTable';

class CourseDetail extends Component {

    state = {
        rolePerms: '',
        course: '',
        announcements: [],
        assignments: [],
        editModal: false,
        annModal: false,
        assignmentsModal: false,
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

    toggleAssignmentModal = () => {
        this.setState({
            assignmentsModal: !this.state.assignmentsModal
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

    updateOnAssignmentAdd = (res) => {
        if (res.isSuccess) {
            this.setState({
                assignments: res.data
            })
        }
    }

    goBack = () => {
        this.props.history.push('/courses', { pod: getPod(this.state.course.podId).data })
    }

    componentWillMount() {
        var stateCopy = this.state;
        var res = getCourse(this.state.course.podId, this.props.match.params.id)
        if (res.isSuccess) {
            stateCopy.course = res.data
            stateCopy.rolePerms = res.data.role
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
                                {isAdmin(this.state.rolePerms) ?
                                    <DropdownItem onClick={this.toggleEditModal}>Edit Course</DropdownItem>
                                    : null
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
                <Button className="btn btn-secondary mb-3 mt-2 font-weight-bold" onClick={this.goBack}>
                    <i className="fas fa-arrow-left fa-fw btn-icon"></i>
                    Courses
                </Button>
                <Row noGutters={true}>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">Course Subject</h4>
                                <p className="text-primary font-weight-bold">{this.state.course.subject}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden', overflowWrap: 'anywhere' }}>
                                <h4 className="mt-1 text-muted">Course Description</h4>
                                <p className="text-primary font-weight-bold">{this.state.course.description}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">Teacher</h4>
                                <p className="text-primary font-weight-bold">{this.state.course.teacherName}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
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
                                                href="#"
                                                className={classnames({ active: this.state.activeTab === '1' })}
                                                onClick={() => { this.toggleTab('1'); }}>
                                                Announcements
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#"
                                                className={classnames({ active: this.state.activeTab === '2' })}
                                                onClick={() => { this.toggleTab('2'); }}>
                                                Assignments
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#"
                                                className={classnames({ active: this.state.activeTab === '3' })}
                                                onClick={() => { this.toggleTab('3'); }}>
                                                Upcoming Events
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#"
                                                className={classnames({ active: this.state.activeTab === '4' })}
                                                onClick={() => { this.toggleTab('4'); }}>
                                                Documents
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    {/* Tab panes */}
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="1">
                                            {!isStudent(this.state.rolePerms) ?
                                                <div className="float-right">
                                                    <button className="btn btn-success btn-sm mb-3 mt-2"
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={this.toggleAnnModal}>
                                                        <em className="fa fa-plus-circle fa-sm button-create-icon"></em>
                                                        Add Announcement
                                                    </button>
                                                </div>
                                                : null
                                            }
                                            <AddAnnouncementForm
                                                course={this.state.course}
                                                modal={this.state.annModal}
                                                updateOnAdd={this.updateOnAnnouncementAdd}
                                                toggle={this.toggleAnnModal}
                                            />
                                            <CourseAnnouncementsTable
                                                course={this.state.course}
                                                announcements={this.state.announcements}
                                                lastEvaluatedKey={this.state.lastEvaluatedKey}
                                            />
                                        </TabPane>
                                        <TabPane tabId="2">
                                            {!isStudent(this.state.rolePerms) ?
                                                <div className="float-right">
                                                    <button className="btn btn-success btn-sm mb-3 mt-2" onClick={this.toggleAssignmentModal}>
                                                        <em className="fa fa-plus-circle fa-sm button-create-icon"></em>
                                                        Add Assignment
                                                    </button>
                                                </div>
                                                : null
                                            }
                                            <AddAssignmentForm
                                                course={this.state.course}
                                                modal={this.state.assignmentsModal}
                                                toggle={this.toggleAssignmentModal}
                                                updateOnAdd={this.updateOnAssignmentAdd}
                                            />
                                            <AssignmentsTable
                                                course={this.state.course}
                                                assignments={this.state.assignments}
                                            />
                                        </TabPane>
                                        <TabPane tabId="3">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</TabPane>
                                        <TabPane tabId="4">
                                            <DocumentsTable
                                                role={this.state.rolePerms}
                                                parent={this.state.course}
                                                parentType="course"
                                            />
                                        </TabPane>
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