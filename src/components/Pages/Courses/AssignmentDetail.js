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
import { getAssignment } from '../../../connectors/Assignments';
import { getPod } from '../../../connectors/Pod';
import { isAdmin, isStudent } from '../../../utils/PermissionChecker'

class AssignmentDetail extends Component {

    state = {
        rolePerms: '',
        assignment: '',
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
        this.props.history.push(`/course/details/${this.props.history.location.state.courseID}`)
    }

    componentWillMount() {
        var stateCopy = this.state;
        var res = getAssignment(this.props.history.location.state.podID, this.props.history.location.state.courseID, this.props.match.params.id)
        if (res.isSuccess) {
            stateCopy.assignment = res.data
            // stateCopy.rolePerms = res.data.role
            this.setState(stateCopy)
        }
    }

    render() {
        console.log(this.state)
        var days = ["Sun", "Mon", "Tues", "Wed", "Thrus", "Fri", "Sat"];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var dueDate = new Date(this.state.assignment.dueDateTime);
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Assignment Details
                        <small>Check out the details and edit a specific assignment</small>
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
                        {/* <EditCourseForm
                            course={this.state.course}
                            modal={this.state.editModal}
                            toggle={this.toggleEditModal}
                            updateOnEdit={this.updateOnCourseEdit}
                        /> */}
                    </div>
                </div>
                <Button className="btn btn-secondary mb-3 mt-2 font-weight-bold" onClick={this.goBack}>
                    <i className="fas fa-arrow-left fa-fw btn-icon"></i>
                    Go back
                </Button>
                <Row noGutters={true}>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">Assignment Title</h4>
                                <p className="text-primary font-weight-bold">{this.state.assignment.title}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden', overflowWrap: 'anywhere' }}>
                                <h4 className="mt-1 text-muted">Assignment Type</h4>
                                <p className="text-primary font-weight-bold">{this.state.assignment.type}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">Due Date</h4>
                                <p className="text-primary font-weight-bold">
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
                                </p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">Points Possible</h4>
                                <p className="text-primary font-weight-bold">{this.state.assignment.points}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">Reference Material</h4>

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
                                                Assignment Details
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#"
                                                className={classnames({ active: this.state.activeTab === '2' })}
                                                onClick={() => { this.toggleTab('2'); }}>
                                                Grades
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    {/* Tab panes */}
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="1">
                                            {!isStudent(this.state.rolePerms) ?
                                                <div className="float-right">
                                                    <button className="btn btn-success btn-sm mb-3 mt-2" onClick={this.toggleAnnModal}>
                                                        <em className="fa fa-plus-circle fa-sm button-create-icon"></em>
                                                        Edit Assignment
                                                    </button>
                                                </div>
                                                : null
                                            }
                                            {/* <AddAnnouncementForm
                                                course={this.state.course}
                                                modal={this.state.annModal}
                                                updateOnAdd={this.updateOnAnnouncementAdd}
                                                toggle={this.toggleAnnModal}
                                            />
                                            <CourseAnnouncementsTable
                                                course={this.state.course}
                                                announcements={this.state.announcements}
                                                lastEvaluatedKey={this.state.lastEvaluatedKey}
                                            /> */}
                                        </TabPane>
                                        <TabPane tabId="2">

                                        </TabPane>
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

export default withRouter(AssignmentDetail)