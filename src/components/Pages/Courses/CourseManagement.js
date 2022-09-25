import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Button, Input, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import PodSelector from '../../Common/PodSelector';
import DaysOfWeekSelector from '../../Common/DaysOfWeekSelector';
import 'react-datetime/css/react-datetime.css';
import Datetime from 'react-datetime';
import CourseCard from './CourseCard';
import Swal from 'sweetalert2';
import { getPods } from '../../../connectors/Pod';
import { getCourses, addCourse } from '../../../connectors/Course';
import FormValidator from '../../Forms/FormValidator';

const response = getPods()

class CourseManagement extends Component {

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
                    isNullTime: false
                }
            }
        },
        selectedPod: '',
        subjectFilter: '',
        pods: response.data,
        courses: [],
        modal: false
    }

    errorMessageStyling = {
        color: '#f05050',
        width: '100%',
        marginTop: '0.25rem',
        fontSize: '80%'
    }

    toggleModal = () => {
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
                        isNullTime: false
                    }
                }
            },
            modal: !this.state.modal
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

    validateSelectors = e => {
        var isNullPod = this.state.formAddCourse.selectedPod === '';
        var isNullDay = this.state.formAddCourse.daysOfWeekInterval === '';
        var isNullTime = this.state.formAddCourse.startTime === '' || this.state.formAddCourse.endTime === '';

        var stateCopy = this.state.formAddCourse;
        stateCopy.selector.error.isNullPod = isNullPod ? true : false;
        stateCopy.selector.error.isNullDay = isNullDay ? true : false;
        stateCopy.selector.error.isNullTime = isNullTime ? true : false;
        this.setState(stateCopy);
        return isNullPod || isNullDay || isNullTime;
    }

    validateSelectorsOnChange = e => {
        var isNullPod = this.state.formAddCourse.selectedPod === '';
        var isNullDay = this.state.formAddCourse.daysOfWeekInterval === '';
        var isNullTime = this.state.formAddCourse.startTime === '' && this.state.formAddCourse.endTime === '';
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

        if (this.state.formAddCourse.description) {
            payload.description = this.state.formAddCourse.description
        }

        // if (this.state.formAddCourse.teacher) {
        //     payload.teacher = this.state.formAddCourse.teacher
        // }

        return JSON.stringify(payload);
    }


    setFormPod = (pod) => {
        var stateCopy = this.state.formAddCourse;
        stateCopy.selectedPod = pod;
        this.setState(stateCopy);
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
        var stateCopy = this.state.formAddCourse;
        if (id === "AM") {
            stateCopy.startTime = date.format("HH:mm:ss")
        }
        else {
            stateCopy.endTime = date.format("HH:mm:ss")
        }
        this.setState(stateCopy);
    }

    setPod = (pod) => {
        this.setState({ selectedPod: pod });
        var res = getCourses(pod, "")
        if (res.isSuccess) {
            this.setState({
                courses: [...res.data]
            })
        }
    };

    handleSearchChange = event => {
        this.setState({ subjectFilter: event.target.value })
    }

    debounce = (fn, delay) => {
        let timerId;
        return (...args) => {
            clearTimeout(timerId);
            timerId = setTimeout(fn, delay, [...args]);
        };
    };

    filterRequest = this.debounce(() => {
        var res = getCourses(this.state.selectedPod, this.state.subjectFilter)
        if (res.isSuccess) {
            this.setState({
                courses: [...res.data]
            })
        }
    }, 500);

    componentDidMount() {
        var stateCopy = this.state
        var res = getPods()
        if (res.isSuccess) {
            stateCopy.pods = res.data
            this.setState(stateCopy)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.subjectFilter !== this.state.subjectFilter) {
            if (this.state.courses) {
                this.setState({ courses: [] });
            }
            this.filterRequest();
        }
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
            var result = addCourse(this.state.formAddCourse.selectedPod, this.constructRequestPayload());
            if (result.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully created course",
                    icon: "success",
                })
                var res = getCourses(this.state.selectedPod, "")
                if (res.isSuccess) {
                    this.setState({
                        courses: [...res.data]
                    })
                }
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

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Course Management
                        <small>Click on a card to be redirected to a more detailed course page</small>
                    </div>

                    <div className="ml-auto">
                        <button className="btn btn-success"
                            onClick={this.toggleModal}>
                            <em className="fa fa-plus-circle fa-sm button-create-icon"></em> Create Course
                        </button>
                        <Modal isOpen={this.state.modal}>
                            <form className="mb-3" name="formAddCourse" onSubmit={this.onSubmit}>
                                <ModalHeader toggle={this.toggleModal}>Create Course</ModalHeader>
                                <ModalBody>
                                    <div className="form-group">
                                        <label className="text-muted">Select Pod</label>
                                        <PodSelector
                                            name="podSelector"
                                            pods={this.state.pods}
                                            hasError={this.state.formAddCourse.selector.error.isNullPod}
                                            validate={this.validateSelectorsOnChange}
                                            setPod={(pod) => this.setFormPod(pod)}
                                            active="required"
                                        />
                                        {this.state.formAddCourse.selector.error.isNullPod && <p style={this.errorMessageStyling}>Pod is required</p>}
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
                                                    this.hasError('formAddCourse', 'subject', 'required')
                                                    || this.hasError('formAddCourse', 'subject', 'maxlen')
                                                    || this.hasError('formAddCourse', 'subject', 'contains-alpha')
                                                    || this.hasError('formAddCourse', 'subject', 'begin-end-spacing')
                                                    || this.hasError('formAddCourse', 'subject', 'consecutive-spacing')
                                                }
                                                onChange={this.validateOnChange}
                                                data-validate='["required", "maxlen", "contains-alpha", "begin-end-spacing", "consecutive-spacing"]'
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
                                            {this.hasError('formAddCourse', 'subject', 'begin-end-spacing') && <span className="invalid-feedback">Subject must not begin or end with a space character</span>}
                                            {this.hasError('formAddCourse', 'subject', 'consecutive-spacing') && <span className="invalid-feedback">Subject must not contain consecutive space characters</span>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-muted">Days</label>
                                        <DaysOfWeekSelector
                                            name="daysOfWeekSelector"
                                            hasError={this.state.formAddCourse.selector.error.isNullDay}
                                            setDays={(day) => this.setDays(day)}
                                            validate={this.validateSelectorsOnChange}
                                        />
                                        {this.state.formAddCourse.selector.error.isNullDay && <p style={this.errorMessageStyling}>Day schedule is required</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-muted">Time</label>
                                        <Row>
                                            <Col lg="6">
                                                <label className="text-muted">Start time: </label>
                                                <Datetime
                                                    inputProps={this.state.formAddCourse.selector.error.isNullTime ? { className: 'form-control time-error', readOnly: true } : { className: 'form-control', readOnly: true }}
                                                    dateFormat={false}
                                                    onChange={(date) => {
                                                        this.setTime(date, "AM")
                                                        this.validateSelectorsOnChange("time")
                                                    }}
                                                />
                                            </Col>
                                            <Col lg="6">
                                                <label className="text-muted">End time: </label>
                                                <Datetime
                                                    inputProps={this.state.formAddCourse.selector.error.isNullTime ? { className: 'form-control time-error', readOnly: true } : { className: 'form-control', readOnly: true }}
                                                    dateFormat={false}
                                                    onChange={(date) => {
                                                        this.setTime(date, "PM")
                                                        this.validateSelectorsOnChange("time")
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.formAddCourse.selector.error.isNullTime && <p style={this.errorMessageStyling}>Time schedule is required</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="text-muted" htmlFor="id-courseTeacher">Teacher</label>
                                        <div className="input-group with-focus">
                                            <Input
                                                type="text"
                                                id="id-courseTeacher"
                                                name="teacher"
                                                className="border-right-0"
                                                placeholder="Teacher's name"
                                                invalid={
                                                    this.hasError('formAddCourse', 'teacher', 'maxlen')
                                                    || (this.state.formAddCourse.teacher && this.hasError('formAddCourse', 'teacher', 'contains-alpha'))
                                                    || this.hasError('formAddCourse', 'teacher', 'name')
                                                    || this.hasError('formAddCourse', 'teacher', 'begin-end-spacing')
                                                    || this.hasError('formAddCourse', 'teacher', 'consecutive-spacing')
                                                }
                                                onChange={this.validateOnChange}
                                                data-validate='["maxlen", "contains-alpha", "name", "begin-end-spacing", "consecutive-spacing"]'
                                                data-param='50'
                                                value={this.state.formAddCourse.teacher || ''} />
                                            <div className="input-group-append">
                                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                                    <em className="fa fa-book"></em>
                                                </span>
                                            </div>
                                            {this.hasError('formAddCourse', 'teacher', 'maxlen') && <span className="invalid-feedback">Teacher must not have more than 50 characters</span>}
                                            {this.hasError('formAddCourse', 'teacher', 'contains-alpha') && <span className="invalid-feedback">Teacher must contain at least one alpha character</span>}
                                            {this.hasError('formAddCourse', 'teacher', 'name') && <span className="invalid-feedback">Teacher must contain alpha, apostrophe, or hyphen characters only</span>}
                                            {this.hasError('formAddCourse', 'teacher', 'begin-end-spacing') && <span className="invalid-feedback">Teacher must not begin or end with a space character</span>}
                                            {this.hasError('formAddCourse', 'teacher', 'consecutive-spacing') && <span className="invalid-feedback">Teacher must not contain consecutive space characters</span>}
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
                                                    this.hasError('formAddCourse', 'description', 'maxlen')
                                                    || (this.state.formAddCourse.description && this.hasError('formAddCourse', 'description', 'contains-alpha'))
                                                    || this.hasError('formAddCourse', 'description', 'begin-end-spacing')
                                                    || this.hasError('formAddCourse', 'description', 'consecutive-spacing')
                                                }
                                                onChange={this.validateOnChange}
                                                data-validate='["maxlen", "contains-alpha", "begin-end-spacing", "consecutive-spacing"]'
                                                data-param='150'
                                                value={this.state.formAddCourse.description || ''}
                                                rows={3} />
                                            <div className="input-group-append">
                                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                                    <em className="fa fa-book"></em>
                                                </span>
                                            </div>
                                            {this.hasError('formAddCourse', 'description', 'maxlen') && <span className="invalid-feedback">Course description must not have more than 150 characters</span>}
                                            {this.hasError('formAddCourse', 'description', 'contains-alpha') && <span className="invalid-feedback">Course description must contain at least one alpha character</span>}
                                            {this.hasError('formAddCourse', 'description', 'begin-end-spacing') && <span className="invalid-feedback">Course description must not begin or end with a space character</span>}
                                            {this.hasError('formAddCourse', 'description', 'consecutive-spacing') && <span className="invalid-feedback">Course description must not contain consecutive space characters</span>}
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                                    <Button color="primary" type="submit">Create</Button>{' '}
                                </ModalFooter>
                            </form>
                        </Modal>
                    </div>
                </div>

                <Row>
                    <Col lg="2">
                        <div className="form-group mb-5">
                            <PodSelector
                                name="podSelector"
                                pods={this.state.pods}
                                setPod={(pod) => this.setPod(pod)}
                                validate={this.validateSelectorsOnChange}
                                active="required"
                            />
                        </div>
                    </Col>
                    <Col lg="2">
                        <div className="form-group mb-5">
                            <input className="form-control mb-2" type="text" placeholder="Search courses by subject" value={this.state.subjectFilter} onChange={this.handleSearchChange} />
                        </div>
                    </Col>
                </Row>

                <div className="row">
                    {this.state.courses.length ?
                        this.state.courses.map(function (course) {
                            return (
                                course.active &&
                                <Col xl="4" lg="6">
                                    <CourseCard
                                        course={course}
                                    />
                                </Col>
                            )
                        }) :
                        <div className='not-found'>
                            <h1>No courses found</h1>
                        </div>
                    }
                </div>
            </ContentWrapper>
        );
    }

}



export default CourseManagement;