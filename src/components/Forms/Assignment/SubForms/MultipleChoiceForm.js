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
import Swal from 'sweetalert2';
import 'react-datetime/css/react-datetime.css';
import { createAssignment, getAssignment } from '../../../../connectors/Assignments';
import QuestionTypeSelector from '../../../Common/QuestionTypeSelector';
import FormValidator from '../../FormValidator';


class MultipleChoiceForm extends Component {

    state = {
        formAddQuestion: {
            question: '',
            questionType: '',
            choices: {
                error: {
                    isNullAnswer: false,
                    isNullChoice: false,
                }
            }
        },
        numberOfChoices: 4,
        assignment: this.props.assignment,
    }

    alphabet = ["A", "B", "C", "D", "E"];

    errorMessageStyling = {
        color: '#f05050',
        width: '100%',
        marginTop: '0.25rem',
        fontSize: '80%'
    }

    toggleModal = () => {
        this.setState({
            formAddQuestion: {
                question: '',
                questionType: '',
                Answer1: '',
                ChoiceA: '',
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

    setMCAnswer = (event) => {
        // don't allow assigning answer if empty choice
        if (!this.state.formAddQuestion['choice' + event.target.value[0]]) return;
        var stateCopy = this.state.formAddQuestion
        stateCopy['answer1'] = this.state.formAddQuestion['choice' + event.target.value[0]]
        // stateCopy['Answer1' + event.target.value[2]] = this.state.formAddQuestion['Choice' + event.target.value[0]]
        this.setState(stateCopy)
    }

    setType = (type) => {
        // var stateCopy = this.state.formAddQuestion;
        // stateCopy.type = type;
        // this.setState(stateCopy)
    }

    validateMCQuestion = () => {
        var numberOfChoices = 0;
        var isNullAnswer = false;
        var isNullChoice = numberOfChoices <= 0;
        if (!this.state.formAddQuestion.answer1) isNullAnswer = true
        for (let i = 0; i < this.state.numberOfChoices; i++) {
            if (this.state['Choice' + this.alphabet[i]]) numberOfChoices += 1;
            if (numberOfChoices >=2) {
                isNullChoice = false;
                break
            }
        }
        var stateCopy = this.state.formAddQuestion;
        stateCopy.choices.error.isNullAnswer = isNullAnswer? true : false;
        stateCopy.choices.error.isNullChoice = isNullChoice? true : false;
        this.setState(stateCopy);
        return isNullAnswer || isNullChoice;
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

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return this.state[formName] &&
            this.state[formName].errors &&
            this.state[formName].errors[inputName] &&
            this.state[formName].errors[inputName][method]
    }

    constructRequestPayload = () => {
        // var payload = {
        //     "title": this.state.formAddQuestion.title,
        //     "type": this.state.formAddQuestion.type,
        //     "dueDateTime": this.state.formAddQuestion.dueDate,
        // };

        // if (this.state.formAddQuestion.instructions) {
        //     payload.instructions = this.state.formAddQuestion.instructions
        // }
        // if (this.state.formAddQuestion.points) {
        //     payload.points = this.state.formAddQuestion.points
        // }
        // if (this.state.ungraded) {
        //     payload.points = 0
        // }
        // if (this.state.formAddQuestion.rubric) {
        //     payload.rubricId = this.state.formAddQuestion.rubric
        // }
        // return JSON.stringify(payload);
    }

    setTime = (date) => {
        // if (date instanceof moment) {
        //     var stateCopy = this.state.formAddQuestion;
        //     stateCopy.dueDate = date.format("YYYY-MM-DD[T]HH:mm:ss.SSSZ")
        //     this.setState(stateCopy);
        // }
    }

    onSubmit = e => {
        e.preventDefault();

        const form = e.target;

        const inputsToValidate = [
            'question',
        ];

        const inputs = [...form.elements].filter(i => inputsToValidate.includes(i.name))

        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                errors
            }
        });

        const invalidChoices = this.validateMCQuestion();

        console.log((hasError || invalidChoices) ? 'Form has errors. Check!' : 'Form Submitted!')

        // if (!hasError && !invalidSelector) {
        //     var result = createAssignment(this.state.course.podId, this.state.course.id, this.constructRequestPayload());
        //     if (result.isSuccess) {
        //         this.toggleModal()
        //         Swal.fire({
        //             title: "Successfully created assignment",
        //             confirmButtonColor: "#5d9cec",
        //             icon: "success",
        //         })
        //         var res = getAssignment(this.state.course.podId, this.state.course.id, result.data.id)
        //         if (res.isSuccess) {
        //             this.props.history.push(`/course/assignment/details/${result.data.id}`, { podID: this.state.course.podId, courseID: this.state.course.id })
        //         }
        //     }
        //     else {
        //         Swal.fire({
        //             title: "Error",
        //             icon: "error",
        //             confirmButtonColor: "#5d9cec",
        //             text: result.message
        //         })
        //     }
        // }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.modal !== prevProps.modal) {
            this.setState({ modal: this.props.modal })
        }
        // if (this.props.assignment !== prevProps.assignment) {
        //     this.setState({ assignment: this.props.assignment })
        // }
    }

    render() { 
        return (
            <div>
                <Modal isOpen={this.state.modal}>
                    <form className="mb-3" name="formAddQuestion" onSubmit={this.onSubmit}>
                        <ModalHeader toggle={this.toggleModal}>Add Question</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="addCourseSubject">Question Type</label>
                                <QuestionTypeSelector
                                    name="typeSelector"
                                    setType={(type) => this.setType(type)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="id-question">Question</label>
                                <div className="input-group with-focus">
                                    <Input
                                        type="textarea"
                                        id="id-question"
                                        name="question"
                                        className="border-right-0"
                                        placeholder="Enter question"
                                        invalid={
                                            this.hasError('formAddQuestion', 'question', 'required')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required"]'
                                        value={this.state.formAddQuestion.question || ''} />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formAddQuestion', 'question', 'required') && <span className="invalid-feedback">Question is required</span>}
                                </div>
                            </div>
                            {Array.from({ length: this.state.numberOfChoices }, (_, i) => this.alphabet[i]).map((e, i) => {
                                i = i + 1;
                                return (
                                    <div className="form-group">
                                        <label className="text-muted" htmlFor={"id-Choice" + i}>Choice {e}</label>
                                        <div className="input-group with-focus">
                                            <Input
                                                type="text"
                                                id={"id-Choice" + e}
                                                name={"choice" + e}
                                                className="border-right-0"
                                                placeholder="Enter a possible answer for the question"
                                                onChange={this.validateOnChange}
                                                value={this.state.formAddQuestion['choice' + e] || ''} />
                                            <div className="input-group-append">
                                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                                    <em className="fa fa-book"></em>
                                                </span>
                                            </div>
                                            {this.state.formAddQuestion.choices.error.isNullAnswer && <p style={this.errorMessageStyling}>Answer is required</p>}
                                            {this.state.formAddQuestion.choices.error.isNullChoice && <p style={this.errorMessageStyling}>Two choices are required</p>}
                                            <div className="input-group">
                                                <input className="mr-2" type="radio" value={[e, i]} name="answer" onChange={this.setMCAnswer} />
                                                <label className="text-muted pt-2"> Correct Answer</label>
                                            </div>
                                        </div>
                                    </div>)
                            })}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                            <Button color="primary" type="submit">Add</Button>{' '}
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default (MultipleChoiceForm, setType)