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
import PodSelector from '../../Common/PodSelector';
import DaysOfWeekSelector from '../../Common/DaysOfWeekSelector';
import TeacherSelector from '../../Common/TeacherSelector';
import Datetime from 'react-datetime';
import Swal from 'sweetalert2';
import 'react-datetime/css/react-datetime.css';
import { getCourses, createCourse } from '../../../connectors/Course';
import { getUsers } from '../../../connectors/PodUser';
import { isAdmin } from '../../../utils/PermissionChecker';
import FormValidator from '../FormValidator';
import moment from 'moment';
import { swalConfirm, dangerText, errorMessageStyling } from '../../../utils/Styles';

class AddCourseForm extends Component {

    state = {
        formAddCourse: {
            subject: '',
            daysOfWeekInterval: '',
            startTime: '',
            endTime: '',
            number: '',
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
        pods: this.props.pods,
        teachers: [],
        modal: false,
    }

    toggleModal = () => {
        this.props.toggle()
        console.log("course")
        this.setState({
            formAddCourse: {
                subject: '',
                daysOfWeekInterval: '',
                startTime: '',
                endTime: '',
                number: '',
                teacher: '',
                description: '',
                selectedPod: '',
                selector: {
                    error: {
                        isNullPod: false,
                        isNullDay: false,
                        isNullTime: false,
                        sNullTeacher: false,
                    }
                }
            },
        });
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
        var isNullPod = this.state.formAddCourse.selectedPod === '';
        var isNullDay = this.state.formAddCourse.daysOfWeekInterval === '';
        var isNullTime = this.state.formAddCourse.startTime === '' || this.state.formAddCourse.endTime === '';
        var isNullTeacher = this.state.formAddCourse.teacher === '';

        var stateCopy = this.state.formAddCourse;
        stateCopy.selector.error.isNullPod = isNullPod ? true : false;
        stateCopy.selector.error.isNullDay = isNullDay ? true : false;
        stateCopy.selector.error.isNullTime = isNullTime ? true : false;
        stateCopy.selector.error.isNullTeacher = isNullTeacher ? true : false;
        this.setState(stateCopy);
        return isNullPod || isNullDay || isNullTime || isNullTeacher;
    }

    validateSelectorsOnChange = e => {
        var isNullPod = this.state.formAddCourse.selectedPod === '';
        var isNullDay = this.state.formAddCourse.daysOfWeekInterval === '';
        var isNullTime = this.state.formAddCourse.startTime === '' || this.state.formAddCourse.endTime === '';
        var isNullTeacher = this.state.formAddCourse.teacher === '';
        var stateCopy = this.state.formAddCourse;
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
            default:
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
            "subject": this.state.formAddCourse.subject,
            "daysOfWeekInterval": this.state.formAddCourse.daysOfWeekInterval,
            "startTime": this.state.formAddCourse.startTime,
            "endTime": this.state.formAddCourse.endTime
        };

        if (this.state.formAddCourse.teacher) {
            payload.teacherEmailId = this.state.formAddCourse.teacher
        }
        if (this.state.formAddCourse.description) {
            payload.description = this.state.formAddCourse.description
        }

        return JSON.stringify(payload);
    }


    setFormPod = (pod) => {
        this.setState({
            formAddCourse: {
                ...this.state.formAddCourse,
                selectedPod: pod,
            },
        });
    }

    setDays = (day) => {
        if (day == null) { return }
        var stateCopy = this.state.formAddCourse;
        var output = ''
        day.forEach((element, idx, array) => {
            if (idx === array.length - 1) {
                output += element.value
            }
            else {
                output += element.value + ','
            }

        });
        stateCopy.daysOfWeekInterval = output
        this.setState(stateCopy);
    }

    setTime = (date, id) => {
        if (date instanceof moment) {
            var stateCopy = this.state.formAddCourse;
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
        var stateCopy = this.state.formAddCourse;
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
            var result = createCourse(this.state.formAddCourse.selectedPod, this.constructRequestPayload());
            if (result.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully created course",
                    confirmButtonColor: swalConfirm(),
                    icon: "success",
                })
                var res = getCourses(this.state.formAddCourse.selectedPod, "")
                if (res.isSuccess) {
                    this.props.updateOnAdd(res, this.state.formAddCourse.selectedPod)
                }
            }
            else {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    confirmButtonColor: swalConfirm(),
                    text: result.message
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.modal !== prevProps.modal) {
            this.setState({ modal: this.props.modal });
        }
        if (this.props.pods !== prevProps.pods) {
            const filteredPods = [];
            this.props.pods.forEach((pod) => {
                if (isAdmin(pod.roleInPod)) filteredPods.push(pod);
            })
            this.setState({ pods: filteredPods });
        }
        if (this.state.formAddCourse.selectedPod !== prevState.formAddCourse.selectedPod) {
            if (!this.state.formAddCourse.selectedPod) return
            var params = this.state.getUserParams;
            var res = getUsers(this.state.formAddCourse.selectedPod,
                params.name,
                params.page,
                params.size,
                params.sort,
                params.role,
                params.inviteStatus);
            if (res.isSuccess) {
                this.setState({ teachers: res.data.users });
            }
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal}>
                <form className="mb-3" name="formAddCourse" onSubmit={this.onSubmit}>
                    <ModalHeader toggle={this.toggleModal}>Create Course</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="addCourseSubject">Select Pod <span style={dangerText()}>*</span></label>
                            <PodSelector
                                name="podSelector"
                                pods={this.state.pods}
                                hasError={this.state.formAddCourse.selector.error.isNullPod}
                                setPod={(pod) => this.setFormPod(pod)}
                                active="required"
                            />
                            {this.state.formAddCourse.selector.error.isNullPod && <p style={errorMessageStyling()}>Pod is required</p>}
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-courseSubject">Subject <span style={dangerText()}>*</span></label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-courseSubject"
                                    name="subject"
                                    className="border-right-0"
                                    placeholder="Enter course subject"
                                    invalid={
                                        this.hasError('formAddCourse', 'subject', 'required')
                                        || this.hasError('formAddCourse', 'subject', 'maxlen')
                                        || this.hasError('formAddCourse', 'subject', 'contains-alpha')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["required", "maxlen", "contains-alpha"]'
                                    data-param='50'
                                    value={this.state.formAddCourse.subject || ''} />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formAddCourse', 'subject', 'required') && <span className="invalid-feedback">Subject is required</span>}
                                {this.hasError('formAddCourse', 'subject', 'maxlen') && <span className="invalid-feedback">Subject must not have more than 50 characters</span>}
                                {this.hasError('formAddCourse', 'subject', 'contains-alpha') && <span className="invalid-feedback">Subject must contain at least one alpha character</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="addDaySchedule">Day Schedule <span style={dangerText()}>*</span></label>
                            <DaysOfWeekSelector
                                name="daysOfWeekSelector"
                                hasError={this.state.formAddCourse.selector.error.isNullDay}
                                setDays={(day) => this.setDays(day)}
                                validate={this.validateSelectorsOnChange}
                            />
                            {this.state.formAddCourse.selector.error.isNullDay && <p style={errorMessageStyling()}>Day schedule is required</p>}
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="addTimeSchedule">Time Schedule <span style={dangerText()}>*</span></label>
                            <Row>
                                <Col lg="6">
                                    <label className="text-muted">Start time: </label>
                                    <Datetime
                                        inputProps={this.state.formAddCourse.selector.error.isNullTime ? { className: 'form-control time-error' } : { className: 'form-control' }}
                                        dateFormat={false}
                                        onChange={(date) => {
                                            this.setTime(date, "start")
                                            this.validateSelectorsOnChange("time")
                                        }}
                                    />
                                </Col>
                                <Col lg="6">
                                    <label className="text-muted">End time: </label>
                                    <Datetime
                                        inputProps={this.state.formAddCourse.selector.error.isNullTime ? { className: 'form-control time-error' } : { className: 'form-control' }}
                                        dateFormat={false}
                                        onChange={(date) => {
                                            this.setTime(date, "end")
                                            this.validateSelectorsOnChange("time")
                                        }}
                                    />
                                </Col>
                            </Row>
                            {this.state.formAddCourse.selector.error.isNullTime && <p style={errorMessageStyling()}>Both start and end times are required and must be valid times</p>}
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-teacher">Teacher <span style={dangerText()}>*</span></label>
                            <TeacherSelector
                                name="teacherSelector"
                                teachers={this.state.teachers}
                                hasError={this.state.formAddCourse.selector.error.isNullTeacher}
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
                                    invalid={
                                        this.hasError('formAddCourse', 'description', 'maxlen')
                                        || this.hasError('formAddCourse', 'description', 'contains-alpha')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["maxlen", "contains-alpha"]'
                                    data-param='250'
                                    value={this.state.formAddCourse.description || ''} />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formAddCourse', 'description', 'maxlen') && <span className="invalid-feedback">Course description must not have more than 250 characters</span>}
                                {this.hasError('formAddCourse', 'description', 'contains-alpha') && <span className="invalid-feedback">Course description must contain at least one alpha character</span>}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter style={{ paddingBottom: '0' }}>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        <Button
                            color="primary"
                            type="submit"
                            onMouseDown={e => e.preventDefault()}
                        >
                            Create
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}

export default AddCourseForm