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
import Datetime from 'react-datetime';
import Swal from 'sweetalert2';
import 'react-datetime/css/react-datetime.css';
import { createAssignment, getAssignments } from '../../../connectors/Assignments';
import AssignmentTypeSelector from '../../Common/AssignmentTypeSelector';
import FormValidator from '../FormValidator';
import moment from 'moment';


class AddAssignmentForm extends Component {

    state = {
        formAddAssignment: {
            title: '',
            type: '',
            instructions: '',
            dueDate: '',
            points: 0,
            referenceRubric: '',
            selector: {
                error: {
                    isNullType: false,
                    isNullDueDate: false,
                }
            }
        },
        ungraded: false,
        course: this.props.course,
        modal: false,
    }

    errorMessageStyling = {
        color: '#f05050',
        width: '100%',
        marginTop: '0.25rem',
        fontSize: '80%'
    }

    toggleModal = () => {
        this.setState({
            formAddAssignment: {
                title: '',
                type: '',
                instructions: '',
                dueDate: '',
                points: 0,
                referenceRubric: '',
                selector: {
                    error: {
                        isNullType: false,
                        isNullDueDate: false,
                    }
                }
            },
        });
        this.props.toggle()
    }

    toggleUngraded = () => {
        this.setState({
            ungraded: !this.state.ungraded
        })
    }

    setType = (type) => {
        var stateCopy = this.state.formAddAssignment;
        stateCopy.type = type;
        this.setState(stateCopy)
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
        var isNullType = this.state.formAddAssignment.type === '';
        var isNullDueDate = this.state.formAddAssignment.dueDate === '';

        var stateCopy = this.state.formAddAssignment;
        stateCopy.selector.error.isNullType = isNullType ? true : false;
        stateCopy.selector.error.isNullDueDate = isNullDueDate ? true : false;

        this.setState(stateCopy);
        return isNullType || isNullDueDate;
    }

    validateSelectorsOnChange = e => {
        var isNullType = this.state.formAddAssignment.selectedPod === '';
        var isNullDueDate = this.state.formAddAssignment.daysOfWeekInterval === '';
        var stateCopy = this.state.formAddAssignment;
        switch (e) {
            case "type":
                stateCopy.selector.error.isNullType = isNullType ? true : false;
                break;
            case "day":
                stateCopy.selector.error.isNullDueDate = isNullDueDate ? true : false;
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
            "title": this.state.formAddAssignment.title,
            "type": this.state.formAddAssignment.type,
            "dueDateTime": this.state.formAddAssignment.dueDate,
        };

        if (this.state.formAddAssignment.instructions) {
            payload.instructions = this.state.formAddAssignment.instructions
        }
        if (this.state.formAddAssignment.points) {
            payload.points = this.state.formAddAssignment.points
        }
        if (this.state.formAddAssignment.rubric) {
            payload.rubricId = this.state.formAddAssignment.rubric
        }
        return JSON.stringify(payload);
    }

    setTime = (date) => {
        if (date instanceof moment) {
            var stateCopy = this.state.formAddAssignment;
            stateCopy.dueDate = date.format("YYYY-MM-DD[T]HH:mm:ss.SSSZ")
            this.setState(stateCopy);
        }
    }

    onSubmit = e => {
        e.preventDefault();

        const form = e.target;

        const inputsToValidate = [
            'title',
            'points',
            'instructions',
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
            var result = createAssignment(this.state.course.podId, this.state.course.id, this.constructRequestPayload());
            if (result.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully created assignment",
                    confirmButtonColor: "#5d9cec",
                    icon: "success",
                })
                var res = getAssignments(this.state.course.podId, this.state.course.id, "")
                if (res.isSuccess) {
                    this.props.updateOnAdd(res)
                }
            }
            else {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    confirmButtonColor: "#5d9cec",
                    text: result.message
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.modal !== prevProps.modal) {
            this.setState({ modal: this.props.modal })
        }
        // if (this.props.pods !== prevProps.pods) {
        //     this.setState({ pods: this.props.pods })
        // }
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.modal}>
                    <form className="mb-3" name="formAddAssignment" onSubmit={this.onSubmit}>
                        <ModalHeader toggle={this.toggleModal}>Create Assignment</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="id-course">Course</label>
                                <Input
                                    type="text"
                                    id="id-course"
                                    name="course"
                                    className="border-right-0"
                                    disabled={true}
                                    value={this.state.course.subject || ''} />
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="id-assignmentTitle">Title</label>
                                <div className="input-group with-focus">
                                    <Input
                                        type="text"
                                        id="id-assignmentTitle"
                                        name="title"
                                        className="border-right-0"
                                        placeholder="Enter assignment title"
                                        invalid={
                                            this.hasError('formAddAssignment', 'title', 'required')
                                            || this.hasError('formAddAssignment', 'title', 'maxlen')
                                            || this.hasError('formAddAssignment', 'title', 'contains-alpha')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "maxlen", "contains-alpha"]'
                                        data-param='50'
                                        value={this.state.formAddAssignment.title || ''} />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formAddAssignment', 'title', 'required') && <span className="invalid-feedback">Title is required</span>}
                                    {this.hasError('formAddAssignment', 'title', 'maxlen') && <span className="invalid-feedback">Title must not have more than 50 characters</span>}
                                    {this.hasError('formAddAssignment', 'title', 'contains-alpha') && <span className="invalid-feedback">Title must contain at least one alpha character</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="addCourseSubject">Assignment Type</label>
                                <AssignmentTypeSelector
                                    name="typeSelector"
                                    hasError={this.state.formAddAssignment.selector.error.isNullType}
                                    setType={(type) => this.setType(type)}
                                    validate={this.validateSelectorsOnChange}
                                />
                                {this.state.formAddAssignment.selector.error.isNullType && <p style={this.errorMessageStyling}>Assignment type is required</p>}
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="id-assignmentInstructions">Instructions</label>
                                <div className="input-group with-focus">
                                    <Input
                                        type="textarea"
                                        id="id-assignmentInstructions"
                                        name="instructions"
                                        className="border-right-0"
                                        placeholder="Enter assignment instructions"
                                        invalid={
                                            this.hasError('formAddAssignment', 'instructions', 'required')
                                            || this.hasError('formAddAssignment', 'instructions', 'maxlen')
                                            || this.hasError('formAddAssignment', 'instructions', 'contains-alpha')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "maxlen", "contains-alpha"]'
                                        data-param='250'
                                        value={this.state.formAddAssignment.instructions || ''} />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formAddAssignment', 'instructions', 'required') && <span className="invalid-feedback">Instructions is required</span>}
                                    {this.hasError('formAddAssignment', 'instructions', 'maxlen') && <span className="invalid-feedback">Instructions must not have more than 250 characters</span>}
                                    {this.hasError('formAddAssignment', 'instructionse', 'contains-alpha') && <span className="invalid-feedback">Instructions must contain at least one alpha character</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted">Due Date</label>
                                <Datetime
                                    inputProps={this.state.formAddAssignment.selector.error.isNullDueDate ? { className: 'form-control time-error' } : { className: 'form-control' }}
                                    onChange={(date) => {
                                        this.setTime(date)
                                        this.validateSelectorsOnChange("time")
                                    }}
                                />
                                {this.state.formAddAssignment.selector.error.isNullDueDate && <p style={this.errorMessageStyling}>Due Date is required</p>}
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="id-points">Points Possible</label>
                                <div className="input-group with-focus">
                                    <Input
                                        type="number"
                                        id="id-points"
                                        name="points"
                                        className="border-right-0"
                                        placeholder="Enter the possible point value"
                                        invalid={
                                            this.hasError('formAddAssignment', 'points', 'required')
                                            || this.hasError('formAddAssignment', 'points', 'number')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "number"]'
                                        disabled={this.state.ungraded}
                                        value={this.state.formAddAssignment.points || ''} />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formAddAssignment', 'points', 'required') && <span className="invalid-feedback">Points are required</span>}
                                    {this.hasError('formAddAssignment', 'points', 'number') && <span className="invalid-feedback">Points must be a number</span>}
                                    <div className="input-group">
                                        <input className="mr-2" type="checkbox" onClick={this.toggleUngraded} />
                                        <label className="text-muted pt-2"> Ungraded</label>
                                    </div>
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
        )
    }
}

export default AddAssignmentForm