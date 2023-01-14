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
import { createAnswerKey, getAnswerKeys } from '../../../connectors/AnswerKey';
import QuestionTypeSelector from '../../Common/QuestionTypeSelector';
import FormValidator from '../FormValidator';


class addQuestionForm extends Component {

    state = {
        formAddQuestion: {
            question: '',
            questionType: 'MC',
            choices: {
                error: {
                    isNullAnswer: false,
                    IsNullAnswerChoice: false,
                    isNullChoice: false,
                }
            }
        },
        numberOfChoices: 2,
        modal: false,
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
                questionType: 'MC',
                choices: {
                    error: {
                        isNullAnswer: false,
                        IsNullAnswerChoice: false,
                        isNullChoice: false,
                    }
                }
            },
            numberOfChoices: 2,
        });
        this.props.toggle()
    }

    addChoice = () => {
        if (this.state.numberOfChoices < 5)
            this.setState({ numberOfChoices: this.state.numberOfChoices + 1 });
    }

    setMCAnswer = (event) => {
        var stateCopy = this.state.formAddQuestion;
        // don't allow assigning answer if empty choice
        if (!this.state.formAddQuestion['choice' + event.target.value]) {
            stateCopy.choices.error.IsNullAnswerChoice = true;
            this.setState(stateCopy);
            return;
        }
        stateCopy['answer1'] = event.target.value;
        stateCopy.choices.error.IsNullAnswerChoice = false;
        this.setState(stateCopy);
    }

    setMAAnswer = (event) => {
        var stateCopy = this.state.formAddQuestion;
        // don't allow assigning answer if empty choice
        if (!this.state.formAddQuestion['choice' + event.target.value[0]]){
            stateCopy.choices.error.IsNullAnswerChoice = true;
            this.setState(stateCopy);
            return;
        }
        if (event.target.checked){
            stateCopy['answer' + event.target.value[2]] = event.target.value[0];
            stateCopy.choices.error.IsNullAnswerChoice = false;
        } 
        else stateCopy['answer' + event.target.value[2]] = ""

        this.setState(stateCopy);
    }

    setTFAnswer = (event) => {
        var stateCopy = this.state.formAddQuestion
        stateCopy['answer1'] = event.target.value
        this.setState(stateCopy)
    }

    setType = (type) => {
        this.setState({
            formAddQuestion: {
                question: this.state.formAddQuestion.question,
                questionType: type,
                choices: {
                    error: {
                        isNullAnswer: false,
                        IsNullAnswerChoice: false,
                        isNullChoice: false,
                    }
                }
            },
        })
    }

    validateMCQuestion = () => {
        var numberOfChoices = 0;
        var isNullAnswer = false;
        var isNullChoice = true;
        if (!this.state.formAddQuestion.answer1) isNullAnswer = true;
        for (let i = 0; i < this.state.numberOfChoices; i++) {
            if (this.state.formAddQuestion['choice' + this.alphabet[i]]) numberOfChoices += 1;
            if (numberOfChoices >= 2) {
                isNullChoice = false;
                break
            }
        }
        var stateCopy = this.state.formAddQuestion;
        stateCopy.choices.error.isNullAnswer = isNullAnswer ? true : false;
        stateCopy.choices.error.isNullChoice = isNullChoice ? true : false;
        this.setState(stateCopy);
        return isNullAnswer || isNullChoice;
    }

    validateMAQuestion = () => {
        var numberOfChoices = 0;
        var isNullAnswer = false;
        var isNullChoice = true;
        if (!this.state.formAddQuestion.answer1) isNullAnswer = true;
        for (let i = 0; i < this.state.numberOfChoices; i++) {
            if (this.state.formAddQuestion['choice' + this.alphabet[i]]) numberOfChoices += 1;
            if (numberOfChoices >= 2) {
                isNullChoice = false;
                break
            }
        }
        var stateCopy = this.state.formAddQuestion;
        stateCopy.choices.error.isNullAnswer = isNullAnswer ? true : false;
        stateCopy.choices.error.isNullChoice = isNullChoice ? true : false;
        this.setState(stateCopy);
        return isNullAnswer || isNullChoice;
    }

    validateTFQuestion = () => {
        var isNullAnswer = false;
        if (!this.state.formAddQuestion.answer1) isNullAnswer = true
        var stateCopy = this.state.formAddQuestion;
        stateCopy.choices.error.isNullAnswer = isNullAnswer ? true : false;
        this.setState(stateCopy);
        return isNullAnswer
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
        // if (input.name.includes("choice") && this.state.formAddQuestion.questionType == "MC") this.validateMCQuestion()
        // else if (input.name.includes("choice") && this.state.formAddQuestion.questionType == "MA") this.validateMAQuestion()
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
            "question": this.state.formAddQuestion.question,
            "questionType": this.state.formAddQuestion.questionType,
        };
        switch (this.state.formAddQuestion.questionType) {
            case "MC":
                var numOfEnteredChoices = 0;
                var numOfEnteredAnswers = 0;
                for (let i = 0; i < this.state.numberOfChoices; i++) {
                    if (this.state.formAddQuestion['choice' + this.alphabet[i]]) {
                        payload['choice' + this.alphabet[numOfEnteredChoices]] = this.state.formAddQuestion['choice' + this.alphabet[i]];
                        numOfEnteredChoices += 1;
                    }
                    if (this.state.formAddQuestion['answer' + (i + 1)]) {
                        numOfEnteredAnswers += 1;
                        payload['answer' + numOfEnteredAnswers] = this.state.formAddQuestion['answer' + numOfEnteredAnswers];
                    }
                }
                break;
            case "MA":
                var numOfEnteredChoices = 0;
                var numOfEnteredAnswers = 0;
                for (let i = 0; i < this.state.numberOfChoices; i++) {
                    if (this.state.formAddQuestion['choice' + this.alphabet[i]]) {
                        payload['choice' + this.alphabet[numOfEnteredChoices]] = this.state.formAddQuestion['choice' + this.alphabet[i]];
                        numOfEnteredChoices += 1;
                    }
                    if (this.state.formAddQuestion['answer' + (i + 1)]) {
                        numOfEnteredAnswers += 1;
                        payload['answer' + numOfEnteredAnswers] = this.state.formAddQuestion['answer' + (i + 1)];
                    }
                }
                break;
            case "TF":
                payload.answer1 = this.state.formAddQuestion.answer1.toUpperCase()
                payload.choiceA = "True"
                payload.choiceB = "False"
                break;
        }
        return JSON.stringify(payload);
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

        var invalidQuestion = false;
        if (this.state.formAddQuestion.questionType == "MC") invalidQuestion = this.validateMCQuestion();
        else if (this.state.formAddQuestion.questionType == "MA") invalidQuestion = this.validateMAQuestion();
        else if (this.state.formAddQuestion.questionType == "TF") invalidQuestion = this.validateTFQuestion();
        if (this.state.formAddQuestion.choices.error.IsNullAnswerChoice) invalidQuestion = true;

        console.log((hasError || invalidQuestion) ? 'Form has errors. Check!' : 'Form Submitted!')

        if (!hasError && !invalidQuestion) {
            var result = createAnswerKey(this.props.podId, this.props.courseId, this.props.assignmentId, this.constructRequestPayload());
            if (result.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully created question",
                    confirmButtonColor: "#5d9cec",
                    icon: "success",
                })
                var res = getAnswerKeys(this.props.podId, this.props.courseId, this.props.assignmentId)
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
        // if (this.props.assignment !== prevProps.assignment) {
        //     this.setState({ assignment: this.props.assignment })
        // }
    }

    render() {
        console.log(this.state)
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
                                    defaultV={this.state.formAddQuestion.questionType}
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
                            {this.state.formAddQuestion.questionType === "MC" ?
                                Array.from({ length: this.state.numberOfChoices }, (_, i) => this.alphabet[i]).map((e, i) => {
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
                                                    invalid={this.state.formAddQuestion.choices.error.isNullChoice}
                                                    onChange={(event) => {
                                                        this.validateOnChange(event)
                                                        if (this.state.formAddQuestion.choices.error.isNullChoice) this.validateMCQuestion()
                                                    }}
                                                    value={this.state.formAddQuestion['choice' + e] || ''} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.state.formAddQuestion.choices.error.isNullAnswer && <span style={this.errorMessageStyling}>Answer is required</span>}
                                                {this.state.formAddQuestion.choices.error.isNullChoice && <span style={this.errorMessageStyling}>Minimum two choices are required</span>}
                                                {this.state.formAddQuestion.choices.error.IsNullAnswerChoice && <span style={this.errorMessageStyling}>Can't set answer for an empty choice</span>}
                                                <div className="input-group">
                                                    <input className="mr-2" type="radio" value={e} name="answer" onChange={(event) => {
                                                        this.setMCAnswer(event)
                                                        this.validateMCQuestion()
                                                    }} />
                                                    <label className="text-muted pt-2">Correct Answer</label>
                                                </div>
                                            </div>
                                        </div>)
                                })
                                : null}
                            {this.state.formAddQuestion.questionType === "MA" ?
                                Array.from({ length: this.state.numberOfChoices }, (_, i) => this.alphabet[i]).map((e, i) => {
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
                                                    invalid={this.state.formAddQuestion.choices.error.isNullChoice}
                                                    onChange={(event) => {
                                                        this.validateOnChange(event)
                                                        if (this.state.formAddQuestion.choices.error.isNullChoice) this.validateMAQuestion()
                                                    }}
                                                    value={this.state.formAddQuestion['choice' + e] || ''} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.state.formAddQuestion.choices.error.isNullAnswer && <span style={this.errorMessageStyling}>Answer is required</span>}
                                                {this.state.formAddQuestion.choices.error.isNullChoice && <span style={this.errorMessageStyling}>Two choices are required</span>}
                                                {this.state.formAddQuestion.choices.error.IsNullAnswerChoice && <span style={this.errorMessageStyling}>Answer for an empty choice won't be saved</span>}
                                                <div className="input-group">
                                                    <input className="mr-2" type="checkbox" value={[e, i]} name="answer" onChange={this.setMAAnswer} />
                                                    <label className="text-muted pt-2">Correct Answer</label>
                                                </div>
                                            </div>
                                        </div>)
                                })
                                : null}
                            {this.state.numberOfChoices < 5 && this.state.formAddQuestion.questionType != "TF" ?
                                <div>
                                    <Button className="btn btn-secondary btn-sm" style={{ marginLeft: "40%" }} onClick={this.addChoice}>Add Choice</Button>
                                </div>
                                : null}
                            {this.state.formAddQuestion.questionType === "TF" ?
                                <div className="input-group">
                                    <input className="mr-2" type="radio" value="a" name="answer" onChange={this.setTFAnswer} />
                                    <label className="text-muted pt-2">True</label>
                                    <input className="mr-2 ml-2" type="radio" value="b" name="answer" onChange={this.setTFAnswer} />
                                    <label className="text-muted pt-2">False</label>
                                    {this.state.formAddQuestion.choices.error.isNullAnswer && <span style={this.errorMessageStyling}>Answer is required</span>}
                                </div>
                                : null}

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

export default withRouter(addQuestionForm)