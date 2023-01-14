import React, { Component } from 'react';
import { withRouter } from 'react-router';
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
import { editAssignment, getAssignment } from '../../../connectors/Assignments';
import AssignmentTypeSelector from '../../Common/AssignmentTypeSelector';
import FormValidator from '../FormValidator';
import moment from 'moment';


class EditAssignmentForm extends Component {

    state = {
        formEditAssignment: {
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
        this.populateForm();
        this.props.toggle();
    }

    toggleUngraded = () => {
        var stateCopy = this.state;
        stateCopy.ungraded = !this.state.ungraded
        stateCopy.formEditAssignment.points = 0
        this.setState(stateCopy)
    }

    setType = (type) => {
        var stateCopy = this.state.formEditAssignment;
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
        var isNullType = this.state.formEditAssignment.type === '';
        var isNullDueDate = this.state.formEditAssignment.dueDate === '';

        var stateCopy = this.state.formEditAssignment;
        stateCopy.selector.error.isNullType = isNullType ? true : false;
        stateCopy.selector.error.isNullDueDate = isNullDueDate ? true : false;

        this.setState(stateCopy);
        return isNullType || isNullDueDate;
    }

    validateSelectorsOnChange = e => {
        var isNullType = this.state.formEditAssignment.selectedPod === '';
        var isNullDueDate = this.state.formEditAssignment.daysOfWeekInterval === '';
        var stateCopy = this.state.formEditAssignment;
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
            "title": this.state.formEditAssignment.title,
            "type": this.state.formEditAssignment.type,
            "dueDateTime": this.state.formEditAssignment.dueDate,
        };
        console.log(this.state.formEditAssignment.dueDate)
        if (this.state.formEditAssignment.instructions) {
            payload.instructions = this.state.formEditAssignment.instructions
        }
        if (this.state.formEditAssignment.points && !this.state.ungraded) {
            payload.points = this.state.formEditAssignment.points
        }
        if (this.state.formEditAssignment.rubric) {
            payload.rubricId = this.state.formEditAssignment.rubric
        }
        return JSON.stringify(payload);
    }

    setTime = (date) => {
        if (date instanceof moment) {
            var stateCopy = this.state.formEditAssignment;
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
            var result = editAssignment(this.state.course.podId, this.state.course.id, this.props.assignmentId, this.constructRequestPayload());
            if (result.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully edited assignment",
                    confirmButtonColor: "#5d9cec",
                    icon: "success",
                })
                var res = getAssignment(this.state.course.podId, this.state.course.id, this.props.assignmentId)
                if (res.isSuccess) {
                    this.props.updateOnEdit(res)
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

    populateForm() {
        var res = getAssignment(this.props.podId, this.props.course.id, this.props.assignmentId)
        if (res.isSuccess) {
            var stateCopy = this.state.formEditAssignment;
            stateCopy.title = res.data.title;
            stateCopy.type = res.data.type;
            stateCopy.instructions = res.data.instructions
            stateCopy.dueDate = moment.utc(res.data.dueDateTime).local()
            stateCopy.points = res.data.points
            this.setState(stateCopy)
        }
    }

    componentWillMount() {
        this.populateForm();
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
                    <form className="mb-3" name="formEditAssignment" onSubmit={this.onSubmit}>
                        <ModalHeader toggle={this.toggleModal}>Edit Assignment</ModalHeader>
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
                                            this.hasError('formEditAssignment', 'title', 'required')
                                            || this.hasError('formEditAssignment', 'title', 'maxlen')
                                            || this.hasError('formEditAssignment', 'title', 'contains-alpha')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "maxlen", "contains-alpha"]'
                                        data-param='50'
                                        value={this.state.formEditAssignment.title || ''} />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formEditAssignment', 'title', 'required') && <span className="invalid-feedback">Title is required</span>}
                                    {this.hasError('formEditAssignment', 'title', 'maxlen') && <span className="invalid-feedback">Title must not have more than 50 characters</span>}
                                    {this.hasError('formEditAssignment', 'title', 'contains-alpha') && <span className="invalid-feedback">Title must contain at least one alpha character</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted">Assignment Type</label>
                                <AssignmentTypeSelector
                                    name="typeSelector"
                                    hasError={this.state.formEditAssignment.selector.error.isNullType}
                                    defaultV={this.state.formEditAssignment.type}
                                    setType={(type) => this.setType(type)}
                                    validate={this.validateSelectorsOnChange}
                                />
                                {this.state.formEditAssignment.selector.error.isNullType && <span style={this.errorMessageStyling}>Assignment type is required</span>}
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
                                            this.hasError('formEditAssignment', 'instructions', 'required')
                                            || this.hasError('formEditAssignment', 'instructions', 'maxlen')
                                            || this.hasError('formEditAssignment', 'instructions', 'contains-alpha')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "maxlen", "contains-alpha"]'
                                        data-param='250'
                                        value={this.state.formEditAssignment.instructions || ''} />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formEditAssignment', 'instructions', 'required') && <span className="invalid-feedback">Instructions is required</span>}
                                    {this.hasError('formEditAssignment', 'instructions', 'maxlen') && <span className="invalid-feedback">Instructions must not have more than 250 characters</span>}
                                    {this.hasError('formEditAssignment', 'instructionse', 'contains-alpha') && <span className="invalid-feedback">Instructions must contain at least one alpha character</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted">Due Date</label>
                                <Datetime
                                    inputProps={this.state.formEditAssignment.selector.error.isNullDueDate ? { className: 'form-control time-error' } : { className: 'form-control' }}
                                    value={moment.utc(this.state.formEditAssignment.dueDate).local()}
                                    onChange={(date) => {
                                        this.setTime(date)
                                        this.validateSelectorsOnChange("time")
                                    }}
                                />
                                {this.state.formEditAssignment.selector.error.isNullDueDate && <span style={this.errorMessageStyling}>Due Date is required</span>}
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
                                            this.hasError('formEditAssignment', 'points', 'required')
                                            || this.hasError('formEditAssignment', 'points', 'number')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate={!this.state.ungraded ? '["required", "number"]' : null}
                                        disabled={this.state.ungraded}
                                        value={this.state.formEditAssignment.points || ''} />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    {!this.state.ungraded ? this.hasError('formEditAssignment', 'points', 'required') && <span className="invalid-feedback">Points are required</span> : null}
                                    {!this.state.ungraded ? this.hasError('formEditAssignment', 'points', 'number') && <span className="invalid-feedback">Points must be a number</span> : null}
                                    <div className="input-group">
                                        <input className="mr-2" type="checkbox" onClick={this.toggleUngraded} />
                                        <label className="text-muted pt-2"> Ungraded</label>
                                    </div>
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
        )
    }
}

export default withRouter(EditAssignmentForm)