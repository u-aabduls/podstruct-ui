import React, { Component } from 'react';
import ContentWrapper from '../../../Layout/ContentWrapper';
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
import { getCourse } from '../../../../connectors/Course';
import { getAssignment, publishAssignment, deleteAssignment } from '../../../../connectors/Assignments';
import { getAnswerKeys, deleteAnswerKey } from '../../../../connectors/AnswerKey';
import { isAdmin, isStudent } from '../../../../utils/PermissionChecker'
import AddQuestionForm from '../../../Forms/Assignment/AddQuestionForm';
import EditQuestionForm from '../../../Forms/Assignment/EditQuestionForm';
import EditAssignmentForm from '../../../Forms/Assignment/EditAssignmentForm';
import Swal from 'sweetalert2';
import DocumentsTable from '../../../Tables/DocumentsTable';
import { swalConfirm, errorMessageStyling } from '../../../../utils/Styles';

class AssignmentDetail extends Component {

    state = {
        rolePerms: '',
        course: '',
        assignment: '',
        questions: [],
        editQuestionModals: {},
        addQuestionModal: false,
        editAssignmentModal: false,
        ddOpen: false,
        activeTab: '1',
        getAnswerKeysParams: {
            page: 0,
            size: 10,
            sort: 'createDate,asc',
        },
        nextPage: true
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

    nextPage = () => {
        if (this.state.questions.length >= this.state.getAnswerKeysParams.size) {
            var stateCopy = this.state
            var params = this.state.getAnswerKeysParams
            var res = getAnswerKeys(this.props.match.params.podId, this.props.match.params.courseId, this.props.match.params.assignmentId, params.page + 1, params.size, params.sort)
            if (res.data.length > 0) {
                stateCopy.questions = res.data
                stateCopy.getAnswerKeysParams.page = this.state.getAnswerKeysParams.page + 1
            }
            else stateCopy.nextPage = false;
            this.setState(stateCopy)
        }
    }

    prevPage = () => {
        if (this.state.getAnswerKeysParams.page) {
            var stateCopy = this.state
            var params = this.state.getAnswerKeysParams
            var res = getAnswerKeys(this.props.match.params.podId, this.props.match.params.courseId, this.props.match.params.assignmentId, params.page - 1, params.size, params.sort)
            if (res.isSuccess) {
                stateCopy.questions = res.data
                stateCopy.getAnswerKeysParams.page = this.state.getAnswerKeysParams.page - 1
                this.setState(stateCopy)
            }
        }
    }

    publish = () => {
        Swal.fire({
            title: this.state.assignment.title + ' will be published and available to all users in this course',
            confirmButtonColor: swalConfirm(),
            confirmButtonText: 'Publish',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                var stateCopy = this.state
                var res = publishAssignment(this.props.match.params.podId, this.props.match.params.courseId, this.props.match.params.assignmentId)
                if (res.isSuccess) {
                    Swal.fire({
                        title: "Successfully published assignment",
                        confirmButtonColor: swalConfirm(),
                        icon: "success",
                    })
                    res = getAssignment(this.props.match.params.podId, this.props.match.params.courseId, this.props.match.params.assignmentId)
                    if (res.isSuccess) {
                        stateCopy.assignment = res.data
                        this.setState(stateCopy)
                    }
                }

            }
        })
    }

    deleteAssignment = () => {
        Swal.fire({
            title: 'Are you sure you want to delete the assignment?',
            showCancelButton: true,
            confirmButtonColor: swalConfirm(),
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var res = deleteAssignment(this.props.match.params.podId, this.props.match.params.courseId, this.props.match.params.assignmentId)
                if (res.isSuccess) {
                    Swal.fire('Successfully deleted assignment', '', 'success');
                    this.goBack();
                }
            }
        })
    }

    deleteQuestion = (questionId) => {
        Swal.fire({
            title: 'Are you sure you want to delete the question?',
            showCancelButton: true,
            confirmButtonColor: swalConfirm(),
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var res = deleteAnswerKey(this.props.match.params.podId, this.props.match.params.courseId, this.props.match.params.assignmentId, questionId)
                if (res.isSuccess) {
                    Swal.fire('Successfully deleted question', '', 'success');
                    var stateCopy = this.state
                    var params = this.state.getAnswerKeysParams
                    res = getAnswerKeys(this.props.match.params.podId, this.props.match.params.courseId, this.props.match.params.assignmentId, params.page, params.size, params.sort)
                    if (res.isSuccess) {
                        stateCopy.questions = res.data
                        this.setState(stateCopy)
                    }
                }
            }
        })
    }

    goBack = () => {
        this.props.history.goBack()
    }

    componentWillMount() {
        var stateCopy = this.state;
        var res = getCourse(this.props.match.params.podId, this.props.match.params.courseId);
        if (res.isSuccess) {
            stateCopy.course = res.data;
            stateCopy.rolePerms = res.data.role;
            this.setState(stateCopy);
        }

        res = getAssignment(this.props.match.params.podId, this.props.match.params.courseId, this.props.match.params.assignmentId)
        if (res.isSuccess) {
            stateCopy.assignment = res.data
            this.setState(stateCopy)
        }

        var params = this.state.getAnswerKeysParams
        res = getAnswerKeys(this.props.match.params.podId, this.props.match.params.courseId, this.props.match.params.assignmentId, params.page, params.size, params.sort)
        if (res.isSuccess) {
            stateCopy.questions = res.data
            res.data.forEach((question, i) => {
                stateCopy.editQuestionModals["questionModal" + (i + 1)] = false;
            })
            this.setState(stateCopy)
        }
    }

    render() {
        var days = ["Sun", "Mon", "Tues", "Wed", "Thrus", "Fri", "Sat"];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        if (this.state.assignment.dueDateTime) var dueDate = new Date(moment.utc(this.state.assignment.dueDateTime).local().format('YYYY-MM-DD HH:mm:ss'));
        if (this.state.assignment.publishDateTime) var publishDate = new Date(moment.utc(this.state.assignment.publishDateTime).local().format('YYYY-MM-DD HH:mm:ss'));
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>{this.state.assignment.title}
                        <small>{this.state.course.subject}</small>
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
                            podId={this.props.match.params.podId}
                            course={this.state.course}
                            assignmentId={this.state.assignment.id}
                            toggle={this.toggleEditAssignmentModal}
                            updateOnEdit={this.updateOnAssignmentEdit}
                            modal={this.state.editAssignmentModal}
                        />
                    </div>
                </div>
                <Button className="btn btn-secondary mb-3 mt-2 font-weight-bold" onClick={this.goBack}>
                    <i className="fas fa-arrow-left fa-fw btn-icon mr-1"></i>
                    {this.state.course.subject}
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
                                <p className="text-primary font-weight-bold">
                                    {
                                        {
                                            'GENERAL': 'General',
                                            'MULTIPLE_CHOICE': 'Multiple Choice',
                                            'FREE_FORM': 'Free Form',
                                            'QUIZ': 'Quiz',
                                            'TEST': 'Test',
                                        }[this.state.assignment.type]
                                    }
                                </p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">Due Date/Time</h4>
                                {dueDate ?
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
                                    : null}
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
                                <h4 className="mt-1 text-muted">Status</h4>
                                <span className="text-primary font-weight-bold">{this.state.assignment.published ? "Published on" : 'Unpublished'}</span>
                                {this.state.assignment.publishDateTime ?
                                    <div>
                                        <span className="text-uppercase text-bold text-primary">
                                            {days[publishDate.getDay()]}
                                            {' '}
                                            {months[publishDate.getMonth()]}
                                            {' '}
                                            {publishDate.getDate()}
                                        </span>
                                        <br />
                                        <span className="text-primary h2 mt0 text-sm">
                                            {moment(publishDate).format("h:mm A")}
                                        </span>
                                    </div>
                                    : null}
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
                                                Assignment
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#"
                                                className={classnames({ active: this.state.activeTab === '2' })}
                                                onClick={() => { this.toggleTab('2'); }}>
                                                Documents
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#"
                                                className={classnames({ active: this.state.activeTab === '3' })}
                                                onClick={() => { this.toggleTab('3'); }}>
                                                Grades
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    {/* Tab panes */}
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="1">
                                            {this.state.assignment.minutesToDoAssignment ?
                                                <div className="float-left">
                                                    <span className="text-bold">Time Limit: {this.state.assignment.minutesToDoAssignment} minutes</span>
                                                </div>
                                                : null
                                            }
                                            {!isStudent(this.state.rolePerms) && !this.state.assignment.published ?
                                                <div className="float-right">
                                                    <button
                                                        className="btn btn-info btn-sm mb-3 mt-2"
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={this.publish}
                                                    >
                                                        <i className="fas fa-upload fa-fw button-create-icon mr-1"></i>
                                                        Publish
                                                    </button>
                                                </div>
                                                : null
                                            }
                                            {!isStudent(this.state.rolePerms) && this.state.assignment.type !== 'GENERAL' ?
                                                <div className="float-right">
                                                    <button
                                                        className="btn btn-primary btn-sm mb-3 mt-2 mr-1"
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={this.toggleAddQuestionModal}
                                                    >
                                                        <i className="fa fa-plus-circle fa-sm button-create-icon"></i>
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
                                                    answers.sort();
                                                    return (
                                                        <Card outline color="dark" className="mt-5 card-default" style={{ clear: 'both', width: '60%', margin: "auto" }}>
                                                            <CardHeader>
                                                                <CardTitle tag="h3">
                                                                    Question {(i + 1) + this.state.getAnswerKeysParams.page * this.state.getAnswerKeysParams.size}
                                                                    {!isStudent(this.state.rolePerms) ?
                                                                        <div className="float-right">
                                                                            <Button
                                                                                className="btn bg-info btn-sm mr-1 mb-3"
                                                                                onMouseDown={e => e.preventDefault()}
                                                                                onClick={() => this.toggleEditQuestionModal(i)}
                                                                            >
                                                                                <i className="fas fa-edit fa-fw btn-icon"></i>
                                                                            </Button>
                                                                            <Button
                                                                                className="btn btn-sm bg-danger mb-3"
                                                                                onMouseDown={e => e.preventDefault()}
                                                                                onClick={() => this.deleteQuestion(question.id)}
                                                                            >
                                                                                <i className="fas fa-trash-alt fa-fw btn-icon"></i>
                                                                            </Button>
                                                                        </div>
                                                                        : null
                                                                    }
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <EditQuestionForm
                                                                podId={this.props.match.params.podId}
                                                                courseId={this.props.match.params.courseId}
                                                                assignmentId={this.state.assignment.id}
                                                                questionId={question.id}
                                                                assignmentType={this.state.assignment.type}
                                                                answerKeyParams={this.state.getAnswerKeysParams}
                                                                questionNumber={(i + 1) + this.state.getAnswerKeysParams.page * this.state.getAnswerKeysParams.size}
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
                                                                    {answers.forEach(function (answer, i) {
                                                                        answerList += answer + ' '
                                                                    })}
                                                                    <tr>
                                                                        <td>
                                                                            <strong>Answers: </strong>
                                                                        </td>
                                                                        <td>
                                                                            {answerList ? answerList : <span className='text-warning' style={errorMessageStyling()}>Must be manually graded</span>}
                                                                        </td>
                                                                    </tr>
                                                                </Table>
                                                            </CardBody>
                                                        </Card>
                                                    )
                                                }) :
                                                this.state.assignment.type !== "GENERAL" ?
                                                    <div className='text-center mt-5 mb-5'>
                                                        <h1>No Questions Found</h1>
                                                    </div>
                                                    : null
                                            }
                                            <div>
                                                {this.state.nextPage && this.state.questions.length >= this.state.getAnswerKeysParams.size ?
                                                    <Button color="secondary" className="btn float-right mt-3 mb-5" size="sm" onClick={this.nextPage}>
                                                        <span><i className="fa fa-chevron-right"></i></span>
                                                    </Button>
                                                    :
                                                    <Button color="secondary" className="btn float-right mt-3 mb-5 invisible" size="sm" onClick={this.nextPage}>
                                                        <span><i className="fa fa-chevron-right"></i></span>
                                                    </Button>}
                                                {this.state.getAnswerKeysParams.page > 0 ?
                                                    <Button color="secondary" className="btn float-right mt-3 mb-5" size="sm" onClick={this.prevPage}>
                                                        <span><i className="fa fa-chevron-left"></i></span>
                                                    </Button>
                                                    :
                                                    <Button color="secondary" className="btn float-right mt-3 mb-5 invisible" size="sm" onClick={this.prevPage}>
                                                        <span><i className="fa fa-chevron-left"></i></span>
                                                    </Button>}
                                            </div>
                                            <AddQuestionForm
                                                podId={this.props.match.params.podId}
                                                courseId={this.props.match.params.courseId}
                                                assignmentId={this.state.assignment.id}
                                                assignmentType={this.state.assignment.type}
                                                answerKeyParams={this.state.getAnswerKeysParams}
                                                modal={this.state.addQuestionModal}
                                                updateOnAdd={this.updateOnQuestionAdd}
                                                toggle={this.toggleAddQuestionModal}
                                            />
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <DocumentsTable
                                                role={this.state.rolePerms}
                                                parent={{
                                                    ...this.state.assignment,
                                                    podId: this.props.match.params.podId,
                                                    courseId: this.props.match.params.courseId
                                                }}
                                                parentType="assignment"
                                            />
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