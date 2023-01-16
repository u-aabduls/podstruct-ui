import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Dropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Row,
    Col,
    Table,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import { getAssignment, deleteAssignment } from '../../../connectors/Assignments';
import { getAnswerKeys } from '../../../connectors/AnswerKey';
import { isAdmin, isStudent } from '../../../utils/PermissionChecker'
import AddQuestionForm from '../../Forms/Assignment/AddQuestionForm';
import EditQuestionForm from '../../Forms/Assignment/EditQuestionForm';
import EditAssignmentForm from '../../Forms/Assignment/EditAssignmentForm';
import Swal from 'sweetalert2';

class AssignmentDetail extends Component {

    state = {
        rolePerms: this.props.history.location.state?.rolePerms,
        assignment: '',
        questions: [],
        editQuestionModals: {
        },
        addQuestionModal: false,
        editAssignmentModal: false,
        ddOpen: false,
        activeTab: '1',
    }

    toggleDD = () => this.setState({
        ddOpen: !this.state.ddOpen
    })

    toggleEditQuestionModal = (i) => {
        var stateCopy = this.state.editQuestionModals;
        stateCopy["questionModal" + (i + 1)] = !this.state.editQuestionModals["questionModal" + (i + 1)]
        this.setState(stateCopy)
        // this.setState({
        //     editQuestionModal: !this.state.editQuestionModal
        // });
    }

    toggleAddQuestionModal = () => {
        this.setState({
            addQuestionModal: !this.state.addQuestionModal
        });
    }

    toggleEditAssignmentModal = () => {
        this.setState({
            editAssignmentModal: !this.state.editAssignmentModal
        });
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    updateOnQuestionEdit = (res) => {
        if (res.isSuccess) {
            this.setState({
                questions: res.data
            })
        }
    }

    updateOnQuestionAdd = (res) => {
        if (res.isSuccess) {
            this.setState({
                questions: res.data
            })
        }
    }

    updateOnAssignmentEdit = (res) => {
        if (res.isSuccess) {
            this.setState({
                assignment: res.data
            })
        }
    }

    deleteAssignment = () => {
        Swal.fire({
            title: 'Are you sure you want to delete the assignment?',
            showCancelButton: true,
            confirmButtonColor: "#5d9cec",
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var res = deleteAssignment(this.props.history.location.state?.podID, this.props.history.location.state?.course.id, this.props.match.params?.id)
                if (res.isSuccess) {
                    Swal.fire('Successfully deleted assignment', '', 'success');
                    this.goBack();
                }

            }
        })
    }

    goBack = () => {
        this.props.history.push(`/course/details/${this.props.history.location.state?.course.id}`)
    }

    componentWillMount() {
        var stateCopy = this.state;
        var res = getAssignment(this.props.history.location.state?.podID, this.props.history.location.state?.course.id, this.props.match.params?.id)
        if (res.isSuccess) {
            stateCopy.assignment = res.data
            this.setState(stateCopy)
        }
        res = getAnswerKeys(this.props.history.location.state?.podID, this.props.history.location.state?.course.id, this.props.match.params?.id)
        if (res.isSuccess) {
            stateCopy.questions = res.data
            res.data.map((question, i) => {
                stateCopy.editQuestionModals["questionModal" + (i + 1)] = false;
            })
            this.setState(stateCopy)
        }
    }

    render() {
        var days = ["Sun", "Mon", "Tues", "Wed", "Thrus", "Fri", "Sat"];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var dueDate = new Date(moment.utc(this.state.assignment.dueDateTime).local().format('YYYY-MM-DD HH:mm:ss'));
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
                                    <DropdownItem onClick={this.toggleEditAssignmentModal}>Edit Assignment</DropdownItem>
                                    : null
                                }
                                {isAdmin(this.state.rolePerms) ?
                                    <DropdownItem onClick={this.deleteAssignment}>Delete Assignment</DropdownItem>
                                    : null
                                }
                            </DropdownMenu>
                        </Dropdown>
                        <EditAssignmentForm
                            podId={this.props.history.location.state?.podID}
                            course={this.props.history.location.state?.course}
                            assignmentId={this.state.assignment.id}
                            toggle={this.toggleEditAssignmentModal}
                            updateOnEdit={this.updateOnAssignmentEdit}
                            modal={this.state.editAssignmentModal}
                        />
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
                                <h4 className="mt-1 text-muted">Due Date/Time</h4>
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
                                <p className="text-primary font-weight-bold">{this.state.assignment.points ? this.state.assignment.points : 'Ungraded'}</p>
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
                                                <div className="float-right" style={{ clear: 'both' }}>
                                                    <button className="btn btn-success btn-sm mb-3 mt-2" onClick={this.toggleAddQuestionModal}>
                                                        <em className="fa fa-plus-circle fa-sm button-create-icon"></em>
                                                        Add Question
                                                    </button>
                                                </div>
                                                : null
                                            }
                                            <Card outline color="dark" className="mt-5 card-default card-fixed-height-assignment" style={{ clear: 'both' }}>
                                                <CardHeader><CardTitle tag="h3">Instructions</CardTitle></CardHeader>
                                                <CardBody style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                                    <p className="ml-3 text-primary font-weight-bold">{this.state.assignment.instructions}</p>
                                                </CardBody>
                                            </Card>
                                            {this.state.questions.length ?
                                                this.state.questions.map((question, i) => {
                                                    var choices = [];
                                                    var answers = [];
                                                    var alphabet = ["A", "B", "C", "D", "E"];
                                                    var answerList = "";
                                                    for (let i = 0; i < 5; i++) {
                                                        if (question['choice' + alphabet[i]])
                                                            choices.push(question['choice' + alphabet[i]])
                                                    }
                                                    for (let i = 0; i < 5; i++) {
                                                        if (question['answer' + (i + 1)])
                                                            answers.push(question['answer' + (i + 1)])
                                                    }
                                                    return (
                                                        <Card outline color="dark" className="mt-5 card-default" style={{ clear: 'both', width: '60%', margin: "auto" }}>
                                                            <CardHeader><CardTitle tag="h3">
                                                                Question {i + 1}
                                                                {!isStudent(this.state.rolePerms) ?
                                                                    <div className="float-right" style={{ clear: 'both' }}>
                                                                        <button className="btn btn-success btn-sm mb-3" onClick={() => this.toggleEditQuestionModal(i)}>
                                                                            <em className="fa fa-plus-circle fa-sm button-create-icon"></em>
                                                                            Edit
                                                                        </button>
                                                                    </div>
                                                                    : null
                                                                }</CardTitle></CardHeader>
                                                            <EditQuestionForm
                                                                podId={this.props.history.location.state?.podID}
                                                                courseId={this.props.history.location.state?.course.id}
                                                                assignmentId={this.state.assignment.id}
                                                                questionId={question.id}
                                                                modal={this.state.editQuestionModals["questionModal" + (i + 1)]}
                                                                updateOnEdit={this.updateOnQuestionEdit}
                                                                toggle={() => this.toggleEditQuestionModal(i)}
                                                            />
                                                            <CardBody style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                                                <Table>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <strong>Question:</strong>
                                                                            </td>
                                                                            <td>
                                                                                {question.question}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                                                <strong>Question Type</strong>
                                                                            </td>
                                                                            <td>
                                                                                {question.questionType}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                    {choices.map(function (choice, i) {
                                                                        return (
                                                                            <tr>
                                                                                <td>
                                                                                    <strong>Choice {alphabet[i]}: </strong>
                                                                                </td>
                                                                                <td>
                                                                                    {choice}
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                    {answers.map(function (answer, i) {
                                                                        answerList += answer + ' '
                                                                        // return (
                                                                        //     <tr>
                                                                        //         <td>
                                                                        //             <strong>Answers: </strong>
                                                                        //         </td>
                                                                        //         <td>
                                                                        //             {answer}
                                                                        //         </td>
                                                                        //     </tr>
                                                                        // )
                                                                    })}
                                                                    <tr>
                                                                        <td>
                                                                            <strong>Answers: </strong>
                                                                        </td>
                                                                        <td>
                                                                            {answerList}
                                                                        </td>
                                                                    </tr>
                                                                </Table>
                                                            </CardBody>
                                                        </Card>
                                                    )
                                                }) :
                                                <div className='text-center mt-5 mb-5'>
                                                    <h1>No Questions Found</h1>
                                                </div>
                                            }
                                            <AddQuestionForm
                                                podId={this.props.history.location.state?.podID}
                                                courseId={this.props.history.location.state?.course.id}
                                                assignmentId={this.state.assignment.id}
                                                modal={this.state.addQuestionModal}
                                                updateOnAdd={this.updateOnQuestionAdd}
                                                toggle={this.toggleAddQuestionModal}
                                            />
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