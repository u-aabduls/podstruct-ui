import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import classnames from 'classnames';
import { Button, 
    Dropdown, 
    DropdownMenu, 
    DropdownToggle, 
    DropdownItem, 
    Input, 
    Row,
    Card,
    CardBody,
    CardHeader,
    Col, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink, } from 'reactstrap';

import PodSelector from '../../Common/PodSelector';
import DaysOfWeekSelector from '../../Common/DaysOfWeekSelector';
import Datetime from 'react-datetime';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';

import { getPods, getCourse, editCourse } from '../../../connectors/Course';
import send from '../../../connectors/PodRetrieval';
import FormValidator from '../../Forms/FormValidator';


class CourseDetail extends Component {

    state = {
        formEditCourse: {
            subject: '',
            daysOfWeekInterval: '',
            startTime: '',
            endTime: '',
            teacher: '',
            description: '',
            selectedPod: '',
            selector: {
                error: {
                    isNullPod: false,
                    isNullDay: false,
                    isNullTime: false
                }
            }
        },
        course: this.props.location.state.course,
        modal: false,
        ddOpen: false,
        activeTab: '1',
    }

    errorMessageStyling = {
        color: '#f05050',
        width: '100%',
        marginTop: '0.25rem',
        fontSize: '80%'
    }

    toggleDD = () => this.setState({
        ddOpen: !this.state.ddOpen
    })

    toggleModal = () => {
        this.populateForm()
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    /**
     * Validate input using onChange event
     * @param  {String} formName The name of the form in the state object
     * @return {Function} a function used for the event
     */
    validateOnChange = event => {
        const input = event.target;
        const form = input.form
        const value = input.type === 'checkbox' ? input.checked : input.value;

        const result = FormValidator.validate(input);

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                [input.name]: value,
                errors: {
                    ...this.state[form.name].errors,
                    [input.name]: result
                }
            }
        });
    }

    validateSelectors = event => {
        var isNullPod = this.state.formEditCourse.selectedPod === '';
        var isNullDay = this.state.formEditCourse.daysOfWeekInterval === '';
        var isNullTime = this.state.formEditCourse.startTime === '' || this.state.formEditCourse.endTime === '';

        var stateCopy = this.state.formEditCourse;
        stateCopy.selector.error.isNullPod = isNullPod ? true : false;
        stateCopy.selector.error.isNullDay = isNullDay ? true : false;
        stateCopy.selector.error.isNullTime = isNullTime ? true : false;
        this.setState(stateCopy);
        return isNullPod || isNullDay || isNullTime;
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return this.state[formName] &&
            this.state[formName].errors &&
            this.state[formName].errors[inputName] &&
            this.state[formName].errors[inputName][method]
    }

    constructRequestPayload = () => {
        return JSON.stringify({
            "subject": this.state.formEditCourse.subject,
            "daysOfWeekInterval": this.state.formEditCourse.daysOfWeekInterval,
            "startTime": this.state.formEditCourse.startTime,
            "endTime": this.state.formEditCourse.endTime,
            "description": this.state.formEditCourse.description,
            // "teacher": this.state.formEditCourse.teacher,
        })
    }

    setDays = (day) => {
        var stateCopy = this.state.formEditCourse;
        var output = ''
        if (day != null) {
            day.forEach((element, idx, array) => {
                if (idx === array.length - 1) {
                    output += element.value
                }
                else {
                    output += element.value + ','
                }

            });
        }
        stateCopy.daysOfWeekInterval = output
        this.setState(stateCopy);
    }

    setTime = (date, id) => {
        var stateCopy = this.state.formEditCourse;
        if (id === "AM") {
            stateCopy.startTime = date.format("HH:mm:ss")
        }
        else {
            stateCopy.endTime = date.format("HH:mm:ss")
        }
        this.setState(stateCopy);
    }

    onSubmit = e => {
        e.preventDefault();

        const form = e.target;

        const inputsToValidate = [
            'subject',
            'number',
            'teacher',
            'description',
        ];

        const inputs = [...form.elements].filter(i => inputsToValidate.includes(i.name))

        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                errors
            }
        });

        const invalidSelector = this.validateSelectors();

        console.log((hasError || invalidSelector) ? 'Form has errors. Check!' : 'Form Submitted!')

        if (!hasError && !invalidSelector) {
            var result = editCourse(this.state.formEditCourse.selectedPod.id, this.state.course.id, this.constructRequestPayload());
            if (result.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully edited course",
                    icon: "success",
                })
                getCourse(this.state.formEditCourse.selectedPod.id, this.state.course.id).then(res => {
                    if (res.isSuccess) {
                        this.setState({
                            course: res.data
                        })
                    }
                })
            }
            else {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: result.message
                })
            }
        }
    }

    populateForm() {
        var stateCopy = this.state.formEditCourse;
        getCourse(this.state.formEditCourse.selectedPod.id, this.state.course.id).then(res => {
            if (res.isSuccess) {
                this.setState({
                    course: res.data
                })
                stateCopy.subject = res.data.subject
                stateCopy.daysOfWeekInterval = res.data.daysOfWeekInterval
                stateCopy.startTime = res.data.startTime
                stateCopy.endTime = res.data.endTime
                stateCopy.teacher = res.data.teacher
                stateCopy.description = res.data.description
                this.setState(stateCopy)
            }
        })
    }

    componentDidMount() {
        var stateCopy = this.state.formEditCourse;
        send(this.props.location.state.course.podId).then(res => {
            if (res.isSuccess) {
                stateCopy.selectedPod = res.data
                this.setState(stateCopy)
            }
        })
        this.populateForm()
    }

    render() {
        console.log(this.state.formEditCourse.daysOfWeekInterval)
        if (this.state.course == null) {
            this.props.history.push('/courses')
        }
        else {
            var daysOfWeek = ["Mon", "Tues", "Wed", "Thrus", "Fri", "Sat", "Sun"]
            var output = ""
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
                                    <DropdownItem onClick={this.toggleModal}>Edit Course</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                                <form className="mb-3" name="formEditCourse" onSubmit={this.onSubmit}>
                                    <ModalHeader toggle={this.toggleModal}>Edit Course</ModalHeader>
                                    <ModalBody>
                                        <div className="form-group">
                                            <label className="text-muted" htmlFor="addCourseSubject">Select Pod</label>
                                            <PodSelector
                                                name="podSelector"
                                                hasError={this.state.formEditCourse.selector.error.isNullPod}
                                                defaultV={this.state.formEditCourse.selectedPod}
                                                disabled={true}
                                            />
                                            {this.state.formEditCourse.selector.error.isNullPod && <p style={this.errorMessageStyling}>Pod is required</p>}
                                        </div>
                                        <div className="form-group">
                                            <label className="text-muted" htmlFor="addCourseSubject">Course Subject</label>
                                            <div className="input-group with-focus">
                                                <Input
                                                    type="text"
                                                    name="subject"
                                                    className="border-right-0"
                                                    placeholder="Enter course subject"
                                                    invalid={
                                                        this.hasError('formEditCourse', 'subject', 'required')
                                                        || this.hasError('formEditCourse', 'subject', 'maxlen')
                                                        || this.hasError('formEditCourse', 'subject', 'contains-alpha')
                                                        || this.hasError('formEditCourse', 'subject', 'begin-end-spacing')
                                                        || this.hasError('formEditCourse', 'subject', 'consecutive-spacing')
                                                    }
                                                    onChange={this.validateOnChange}
                                                    data-validate='["required", "maxlen", "contains-alpha", "begin-end-spacing", "consecutive-spacing"]'
                                                    data-param='50'
                                                    value={this.state.formEditCourse.subject} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.hasError('formEditCourse', 'subject', 'required') && <span className="invalid-feedback">Subject is required</span>}
                                                {this.hasError('formEditCourse', 'subject', 'maxlen') && <span className="invalid-feedback">Subject must not have more than 50 characters</span>}
                                                {this.hasError('formEditCourse', 'subject', 'contains-alpha') && <span className="invalid-feedback">Subject must contain at least one alpha character</span>}
                                                {this.hasError('formEditCourse', 'subject', 'begin-end-spacing') && <span className="invalid-feedback">Subject must not begin or end with a space character</span>}
                                                {this.hasError('formEditCourse', 'subject', 'consecutive-spacing') && <span className="invalid-feedback">Subject must not contain consecutive space characters</span>}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="text-muted" htmlFor="addDaySchedule">Day Schedule</label>
                                            <DaysOfWeekSelector
                                                name="daysOfWeekSelector"
                                                defaultv={this.state.formEditCourse.daysOfWeekInterval.split(",")}
                                                hasError={this.state.formEditCourse.selector.error.isNullDay}
                                                setDays={(day) => this.setDays(day)}
                                            />
                                            {this.state.formEditCourse.selector.error.isNullDay && <p style={this.errorMessageStyling}>Day schedule is required</p>}
                                        </div>
                                        <div className="form-group">
                                            <label className="text-muted" htmlFor="addTimeSchedule">Time Schedule</label>
                                            <Row>
                                                <Col lg="6">
                                                    <label className="text-muted">Start time: </label>
                                                    <Datetime
                                                        inputProps={this.state.formEditCourse.selector.error.isNullTime ? { className: 'form-control time-error', readOnly: true } : { className: 'form-control', readOnly: true }}
                                                        dateFormat={false}
                                                        onChange={(date) => this.setTime(date, "AM")}
                                                        value={moment(this.state.formEditCourse.startTime, "HH:mm:ss").format("h:mm A")}
                                                    />
                                                </Col>
                                                <Col lg="6">
                                                    <label className="text-muted">End time: </label>
                                                    <Datetime
                                                        inputProps={this.state.formEditCourse.selector.error.isNullTime ? { className: 'form-control time-error', readOnly: true } : { className: 'form-control', readOnly: true }}
                                                        dateFormat={false}
                                                        onChange={(date) => this.setTime(date, "PM")}
                                                        value={moment(this.state.formEditCourse.endTime, "HH:mm:ss").format("h:mm A")}
                                                    />
                                                </Col>
                                            </Row>
                                            {this.state.formEditCourse.selector.error.isNullTime && <p style={this.errorMessageStyling}>Time schedule is required</p>}
                                        </div>
                                        <div className="form-group">
                                            <label className="text-muted" htmlFor="addCourseTeacher">Teacher</label>
                                            <div className="input-group with-focus">
                                                <Input
                                                    type="text"
                                                    name="teacher"
                                                    className="border-right-0"
                                                    placeholder="Enter teacher's name"
                                                    invalid={
                                                        this.hasError('formEditCourse', 'teacher', 'required')
                                                        || this.hasError('formEditCourse', 'teacher', 'maxlen')
                                                        || this.hasError('formEditCourse', 'teacher', 'contains-alpha')
                                                        || this.hasError('formEditCourse', 'teacher', 'name')
                                                        || this.hasError('formEditCourse', 'teacher', 'begin-end-spacing')
                                                        || this.hasError('formEditCourse', 'teacher', 'consecutive-spacing')
                                                    }
                                                    onChange={this.validateOnChange}
                                                    data-validate='["required", "maxlen", "contains-alpha", "name", "begin-end-spacing", "consecutive-spacing"]'
                                                    data-param='50'
                                                    value={this.state.formEditCourse.teacher} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.hasError('formEditCourse', 'teacher', 'required') && <span className="invalid-feedback">Teacher is required</span>}
                                                {this.hasError('formEditCourse', 'teacher', 'maxlen') && <span className="invalid-feedback">Teacher must not have more than 50 characters</span>}
                                                {this.hasError('formEditCourse', 'teacher', 'contains-alpha') && <span className="invalid-feedback">Teacher must contain at least one alpha character</span>}
                                                {this.hasError('formEditCourse', 'teacher', 'name') && <span className="invalid-feedback">Teacher must contain alpha, apostrophe, or hyphen characters only</span>}
                                                {this.hasError('formEditCourse', 'teacher', 'begin-end-spacing') && <span className="invalid-feedback">Teacher must not begin or end with a space character</span>}
                                                {this.hasError('formEditCourse', 'teacher', 'consecutive-spacing') && <span className="invalid-feedback">Teacher must not contain consecutive space characters</span>}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="text-muted" htmlFor="addDescription">Course Description</label>
                                            <div className="input-group with-focus">
                                                <Input
                                                    type="textarea"
                                                    name="description"
                                                    className="border-right-0"
                                                    placeholder="Enter course description"
                                                    invalid={
                                                        this.hasError('formEditCourse', 'description', 'required')
                                                        || this.hasError('formEditCourse', 'description', 'maxlen')
                                                        || this.hasError('formEditCourse', 'description', 'contains-alpha')
                                                        || this.hasError('formEditCourse', 'description', 'begin-end-spacing')
                                                        || this.hasError('formEditCourse', 'description', 'consecutive-spacing')
                                                    }
                                                    onChange={this.validateOnChange}
                                                    data-validate='["required", "maxlen", "contains-alpha", "begin-end-spacing", "consecutive-spacing"]'
                                                    data-param='150'
                                                    value={this.state.formEditCourse.description} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.hasError('formEditCourse', 'description', 'required') && <span className="invalid-feedback">Course description is required</span>}
                                                {this.hasError('formEditCourse', 'description', 'maxlen') && <span className="invalid-feedback">Course description must not have more than 150 characters</span>}
                                                {this.hasError('formEditCourse', 'description', 'contains-alpha') && <span className="invalid-feedback">Course description must contain at least one alpha character</span>}
                                                {this.hasError('formEditCourse', 'description', 'begin-end-spacing') && <span className="invalid-feedback">Course description must not begin or end with a space character</span>}
                                                {this.hasError('formEditCourse', 'description', 'consecutive-spacing') && <span className="invalid-feedback">Course description must not contain consecutive space characters</span>}
                                            </div>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                                        <Button color="primary" type="submit">Edit</Button>{' '}
                                    </ModalFooter>
                                </form>
                            </Modal>
                        </div>
                    </div>
                    <Row noGutters={true}>
                        <Col md={3}>
                            {/* START card */}
                            <div className="card-fixed-height">
                                <div className="card-body">
                                    <h4 className="mt-1 text-muted">Course Subject</h4>
                                    <p className="text-primary font-weight-bold">{this.state.course.subject}</p>
                                </div>
                            </div>
                            {/* END card */}
                        </Col>
                        <Col md={3}>
                            {/* START card */}
                            <div className="card-fixed-height">
                                <div className="card-body">
                                    <h4 className="mt-1 text-muted">Course Description</h4>
                                    <p className="text-primary font-weight-bold">{this.state.course.description}</p>
                                </div>
                            </div>
                            {/* END card */}
                        </Col>
                        <Col md={3}>
                            {/* START card */}
                            <div className="card-fixed-height">
                                <div className="card-body">
                                    <h4 className="mt-1 text-muted">Teacher</h4>
                                    <p className="text-primary font-weight-bold"></p>
                                </div>
                            </div>
                            {/* END card */}
                        </Col>
                        <Col md={3}>
                            {/* START card */}
                            <div className="card-fixed-height">
                                <div className="card-body">
                                    <h4 className="mt-1 text-muted">Course Schedule</h4>
                                    <p className="text-primary font-weight-bold">{this.state.course.daysOfWeekInterval.split(',').forEach(function (i, idx, array) {
                                        if (idx === array.length - 1) {
                                            output += daysOfWeek[i - 1]
                                        }
                                        else {
                                            output += daysOfWeek[i - 1] + '/'
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
                    <Row>
                        <Col md={12}>
                            <Card className="card">
                                <CardHeader>Basic Tabs</CardHeader>
                                <CardBody>
                                    <div role="tabpanel">
                                        {/* Nav tabs */}
                                        <Nav tabs>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({ active: this.state.activeTab === '1' })}
                                                    onClick={() => { this.toggleTab('1'); }}>
                                                    Home
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({ active: this.state.activeTab === '2' })}
                                                    onClick={() => { this.toggleTab('2'); }}>
                                                    Profile
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({ active: this.state.activeTab === '3' })}
                                                    onClick={() => { this.toggleTab('3'); }}>
                                                    Messages
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({ active: this.state.activeTab === '4' })}
                                                    onClick={() => { this.toggleTab('4'); }}>
                                                    Settings
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                        {/* Tab panes */}
                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">Suspendisse velit erat, vulputate sit amet feugiat a, lobortis nec felis.</TabPane>
                                            <TabPane tabId="2">Integer lobortis commodo auctor.</TabPane>
                                            <TabPane tabId="3">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</TabPane>
                                            <TabPane tabId="4">Sed commodo tellus ut mi tristique pharetra.</TabPane>
                                        </TabContent>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ContentWrapper>
            )
        }
    }
}

export default CourseDetail