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
import Datetime from 'react-datetime';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import { getPod } from '../../../connectors/Pod';
import { getCourse, editCourse } from '../../../connectors/Course';
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
                    isNullTime: false
                }
            }
        },
        course: this.props.course,
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

        var stateCopy = this.state.formEditCourse;
        stateCopy.selector.error.isNullPod = isNullPod ? true : false;
        stateCopy.selector.error.isNullDay = isNullDay ? true : false;
        stateCopy.selector.error.isNullTime = isNullTime ? true : false;
        this.setState(stateCopy);
        return isNullPod || isNullDay || isNullTime;
    }

    validateSelectorsOnChange = e => {
        var isNullPod = this.state.formAddCourse.selectedPod === '';
        var isNullDay = this.state.formAddCourse.daysOfWeekInterval === '';
        var isNullTime = this.state.formAddCourse.startTime === '' || this.state.formAddCourse.endTime === '';
        var stateCopy = this.state.formAddCourse;
        switch (e){
            case "pod":
                stateCopy.selector.error.isNullPod = isNullPod ? true : false;
                break;
            case "day":
                stateCopy.selector.error.isNullDay = isNullDay ? true : false;
                break;
            case "time":
                stateCopy.selector.error.isNullTime = isNullTime ? true : false;
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

        if (this.state.formEditCourse.description) {
            payload.description = this.state.formEditCourse.description
        }

        // if (this.state.formAddCourse.teacher) {
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
            var res = editCourse(this.state.formEditCourse.selectedPod.id, this.state.course.id, this.constructRequestPayload());
            if (res.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully edited course",
                    icon: "success",
                })
                var res = getCourse(this.state.formEditCourse.selectedPod.id, this.state.course.id)
                this.props.updateOnEdit(res)
            }
            else {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: res.message
                })
            }
        }
    }

    populateForm() {
        var stateCopy = this.state.formEditCourse;
        var res = getCourse(this.state.formEditCourse.selectedPod.id, this.state.course.id)
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
    }

    componentDidMount() {
        var stateCopy = this.state.formEditCourse;
        var res = getPod(this.props.course.podId)
        if (res.isSuccess) {
            stateCopy.selectedPod = res.data
            this.setState(stateCopy)
        }
        this.populateForm()
    }

    componentDidUpdate(prevProps) {
        if (this.props.modal !== prevProps.modal) {
            this.setState({ modal: this.props.modal })
            this.populateForm()
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal}>
                <form className="mb-3" name="formEditCourse" onSubmit={this.onSubmit}>
                    <ModalHeader toggle={this.toggleModal}>Edit Course</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="podSelector">Select Pod</label>
                            <PodSelector
                                name="podSelector"
                                hasError={this.state.formEditCourse.selector.error.isNullPod}
                                defaultV={this.state.formEditCourse.selectedPod}
                                validate={this.validateSelectorsOnChange}
                                disabled={true}
                            />
                            {this.state.formEditCourse.selector.error.isNullPod && <p style={this.errorMessageStyling}>Pod is required</p>}
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
                                        inputProps={this.state.formEditCourse.selector.error.isNullTime ? { className: 'form-control time-error', readOnly: true } : { className: 'form-control', readOnly: true }}
                                        dateFormat={false}
                                        onChange={(date) => {
                                            this.setTime(date, "AM")
                                            this.validateSelectorsOnChange("time")
                                        }}
                                        value={moment(this.state.formEditCourse.startTime, "HH:mm:ss").format("h:mm A")}
                                    />
                                </Col>
                                <Col lg="6">
                                    <label className="text-muted">End time: </label>
                                    <Datetime
                                        inputProps={this.state.formEditCourse.selector.error.isNullTime ? { className: 'form-control time-error', readOnly: true } : { className: 'form-control', readOnly: true }}
                                        dateFormat={false}
                                        onChange={(date) => {
                                            this.setTime(date, "PM")
                                            this.validateSelectorsOnChange("time")
                                        }}
                                        value={moment(this.state.formEditCourse.endTime, "HH:mm:ss").format("h:mm A")}
                                    />
                                </Col>
                            </Row>
                            {this.state.formEditCourse.selector.error.isNullTime && <p style={this.errorMessageStyling}>Time schedule is required</p>}
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-teacher">Teacher</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-teacher"
                                    name="teacher"
                                    className="border-right-0"
                                    placeholder="Teacher's name"
                                    invalid={
                                        this.hasError('formEditCourse', 'teacher', 'maxlen')
                                        || this.hasError('formEditCourse', 'teacher', 'contains-alpha')
                                        || this.hasError('formEditCourse', 'teacher', 'name')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["maxlen", "contains-alpha", "name"]'
                                    data-param='50'
                                    value={this.state.formEditCourse.teacher} />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formEditCourse', 'teacher', 'maxlen') && <span className="invalid-feedback">Teacher must not have more than 50 characters</span>}
                                {this.hasError('formEditCourse', 'teacher', 'contains-alpha') && <span className="invalid-feedback">Teacher must contain at least one alpha character</span>}
                                {this.hasError('formEditCourse', 'teacher', 'name') && <span className="invalid-feedback">Teacher must contain alpha, apostrophe, or hyphen characters only</span>}
                            </div>
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
                                    data-param='150'
                                    value={this.state.formEditCourse.description} 
                                    rows={3} />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formEditCourse', 'description', 'maxlen') && <span className="invalid-feedback">Course description must not have more than 150 characters</span>}
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