import React, { Component } from 'react';
import {
    Button,
    Input,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import DaysOfWeekSelector from '../../Common/DaysOfWeekSelector';
import TeacherSelector from '../../Common/TeacherSelector';
import Datetime from 'react-datetime';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import { getPod } from '../../../connectors/Pod';
import { getCourse, editCourse } from '../../../connectors/Course';
import { getUsers } from '../../../connectors/PodUser';
import FormValidator from '../FormValidator';

class EditCourseForm extends Component {

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
                    isNullTime: false,
                    isNullTeacher: false,
                }
            }
        },
        getUserParams: {
            name: '',
            page: 0,
            size: 10,
            sort: '',
            role: 'TEACHER,ADMIN',
            inviteStatus: 'ACCEPTED'
        },
        course: this.props.course,
        teachers: [],
        modal: this.props.modal,
    }

    toggleModal = () => {
        this.populateForm()
        this.props.toggle()
    }

    errorMessageStyling = {
        color: '#f05050',
        width: '100%',
        marginTop: '0.25rem',
        fontSize: '80%'
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
        var isNullTeacher = this.state.formEditCourse.teacher === '';

        var stateCopy = this.state.formEditCourse;
        stateCopy.selector.error.isNullPod = isNullPod ? true : false;
        stateCopy.selector.error.isNullDay = isNullDay ? true : false;
        stateCopy.selector.error.isNullTime = isNullTime ? true : false;
        stateCopy.selector.error.isNullTeacher = isNullTeacher ? true : false;
        this.setState(stateCopy);
        return isNullPod || isNullDay || isNullTime || isNullTeacher;
    }

    validateSelectorsOnChange = e => {
        var isNullPod = this.state.formEditCourse.selectedPod === '';
        var isNullDay = this.state.formEditCourse.daysOfWeekInterval === '';
        var isNullTime = this.state.formEditCourse.startTime === '' || this.state.formEditCourse.endTime === '';
        var isNullTeacher = this.state.formEditCourse.teacher === '';
        var stateCopy = this.state.formEditCourse;
        switch (e) {
            case "pod":
                stateCopy.selector.error.isNullPod = isNullPod ? true : false;
                break;
            case "day":
                stateCopy.selector.error.isNullDay = isNullDay ? true : false;
                break;
            case "time":
                stateCopy.selector.error.isNullTime = isNullTime ? true : false;
                break;
            case "teacher":
                stateCopy.selector.error.isNullTeacher = isNullTeacher ? true : false;
                break;
        }
        this.setState(stateCopy);
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return this.state[formName] &&
            this.state[formName].errors &&
            this.state[formName].errors[inputName] &&
            this.state[formName].errors[inputName][method]
    }

    constructRequestPayload = () => {
        var payload = {
            "subject": this.state.formEditCourse.subject,
            "daysOfWeekInterval": this.state.formEditCourse.daysOfWeekInterval,
            "startTime": this.state.formEditCourse.startTime,
            "endTime": this.state.formEditCourse.endTime
        };

        if (this.state.formEditCourse.teacher) {
            payload.teacherEmailId = this.state.formEditCourse.teacher
        }
        if (this.state.formEditCourse.description) {
            payload.description = this.state.formEditCourse.description
        }

        // if (this.state.formEditCourse.teacher) {
        //     payload.teacher = this.state.formEditCourse.teacher
        // }

        return JSON.stringify(payload);
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
        if (date instanceof moment){
            var stateCopy = this.state.formEditCourse;
            if (id === "start") {
                stateCopy.startTime = date.format("HH:mm:ss")
            }
            else {
                stateCopy.endTime = date.format("HH:mm:ss")
            }
            this.setState(stateCopy);
        } 
    }

    setTeacher = (teacher) => {
        var stateCopy = this.state.formEditCourse;
        stateCopy.teacher = teacher
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
            var res = editCourse(this.state.formEditCourse.selectedPod.id, this.state.course.id, this.constructRequestPayload());
            if (res.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully edited course",
                    confirmButtonColor: "#5d9cec",
                    icon: "success",
                })
                var res = getCourse(this.state.formEditCourse.selectedPod.id, this.state.course.id)
                this.props.updateOnEdit(res)
            }
            else {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    confirmButtonColor: "#5d9cec",
                    text: res.message
                })
            }
        }
    }

    populateForm() {
        var stateCopy = this.state;
        var res = getPod(this.props.course.podId)
        if (res.isSuccess) {
            stateCopy.formEditCourse.selectedPod = res.data
        }
        var params = this.state.getUserParams
        res = getUsers(this.state.formEditCourse.selectedPod.id, params.name, params.page, params.size, params.sort, params.role, params.inviteStatus)
        if (res.isSuccess) {
            stateCopy.teachers = res.data.users
        }
        res = getCourse(this.state.formEditCourse.selectedPod.id, this.state.course.id)
        if (res.isSuccess) {
            stateCopy.course = res.data
            stateCopy.formEditCourse.subject = res.data.subject
            stateCopy.formEditCourse.daysOfWeekInterval = res.data.daysOfWeekInterval
            stateCopy.formEditCourse.startTime = res.data.startTime
            stateCopy.formEditCourse.endTime = res.data.endTime
            stateCopy.formEditCourse.teacher = res.data.teacherName
            stateCopy.formEditCourse.description = res.data.description
        }
        this.setState(stateCopy)
    }

    componentDidUpdate(prevProps) {
        if (this.props.modal !== prevProps.modal) {
            if (this.props.modal) this.populateForm()
            this.setState({ modal: this.props.modal })
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal}>
                <form className="mb-3" name="formEditCourse" onSubmit={this.onSubmit}>
                    <ModalHeader toggle={this.toggleModal}>Edit Course</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="pod">Pod</label>
                            <Input
                                name="pod"
                                placeholder={this.state.formEditCourse.selectedPod.podName}
                                disabled={true}
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-courseSubject">Subject</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-courseSubject"
                                    name="subject"
                                    className="border-right-0"
                                    placeholder="Subject"
                                    invalid={
                                        this.hasError('formEditCourse', 'subject', 'required')
                                        || this.hasError('formEditCourse', 'subject', 'maxlen')
                                        || this.hasError('formEditCourse', 'subject', 'contains-alpha')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["required", "maxlen", "contains-alpha"]'
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
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="addDaySchedule">Day Schedule</label>
                            <DaysOfWeekSelector
                                name="daysOfWeekSelector"
                                defaultv={this.state.formEditCourse.daysOfWeekInterval.split(",")}
                                hasError={this.state.formEditCourse.selector.error.isNullDay}
                                validate={this.validateSelectorsOnChange}
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
                                        inputProps={this.state.formEditCourse.selector.error.isNullTime ? { className: 'form-control time-error'} : { className: 'form-control'}}
                                        dateFormat={false}
                                        onChange={(date) => {
                                            this.setTime(date, "start")
                                            this.validateSelectorsOnChange("time")
                                        }}
                                        value={moment(this.state.formEditCourse.startTime, "HH:mm:ss").format("h:mm A")}
                                    />
                                </Col>
                                <Col lg="6">
                                    <label className="text-muted">End time: </label>
                                    <Datetime
                                        inputProps={this.state.formEditCourse.selector.error.isNullTime ? { className: 'form-control time-error'} : { className: 'form-control'}}
                                        dateFormat={false}
                                        onChange={(date) => {
                                            this.setTime(date, "end")
                                            this.validateSelectorsOnChange("time")
                                        }}
                                        value={moment(this.state.formEditCourse.endTime, "HH:mm:ss").format("h:mm A")}
                                    />
                                </Col>
                            </Row>
                            {this.state.formEditCourse.selector.error.isNullTime && <p style={this.errorMessageStyling}>Both start and end times are required and must be valid times</p>}
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-teacher">Teacher</label>
                                <TeacherSelector
                                    name="teacherSelector"
                                    teachers={this.state.teachers}
                                    defaultv={this.state.formEditCourse.teacher}
                                    hasError={this.state.formEditCourse.selector.error.isNullTeacher}
                                    validate={this.validateSelectorsOnChange}
                                    setTeacher={this.setTeacher}
                                />
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-courseDescription">Description</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="textarea"
                                    id="id-courseDescription"
                                    name="description"
                                    className="border-right-0 no-resize"
                                    placeholder="Description"
                                    invalid={
                                        this.hasError('formEditCourse', 'description', 'maxlen')
                                        || this.hasError('formEditCourse', 'description', 'contains-alpha')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["maxlen", "contains-alpha"]'
                                    data-param='250'
                                    value={this.state.formEditCourse.description}
                                    rows={3} />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formEditCourse', 'description', 'maxlen') && <span className="invalid-feedback">Course description must not have more than 250 characters</span>}
                                {this.hasError('formEditCourse', 'description', 'contains-alpha') && <span className="invalid-feedback">Course description must contain at least one alpha character</span>}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        <Button color="primary" type="submit">Edit</Button>{' '}
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}

export default EditCourseForm