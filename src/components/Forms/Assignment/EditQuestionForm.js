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
import { getAnswerKey, getAnswerKeys, editAnswerKey } from '../../../connectors/AnswerKey';
import QuestionTypeSelector from '../../Common/QuestionTypeSelector';
import FormValidator from '../FormValidator';
import { swalConfirm, errorMessageStyling } from '../../../utils/Styles';

class editQuestionForm extends Component {

    state = {
        formEditQuestion: {
            question: '',
            questionType: '',
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
        getAnswerKeysParams: this.props.answerKeyParams
    }

    alphabet = ["A", "B", "C", "D", "E"];

    toggleModal = () => {
        this.props.toggle()
        this.populateForm()
    }

    addChoice = () => {
        if (this.state.numberOfChoices < 5)
            this.setState({ numberOfChoices: this.state.numberOfChoices + 1 });
    }

    setMCAnswer = (event) => {
        var stateCopy = this.state.formEditQuestion;
        // don't allow assigning answer if empty choice
        if (!this.state.formEditQuestion['choice' + event.target.value]) {
            stateCopy.choices.error.IsNullAnswerChoice = true;
            this.setState(stateCopy);
            return;
        }
        stateCopy['answer1'] = event.target.value;
        stateCopy.choices.error.IsNullAnswerChoice = false;
        this.setState(stateCopy);
    }

    setMAAnswer = (event) => {
        var stateCopy = this.state.formEditQuestion;
        // don't allow assigning answer if empty choice
        if (!this.state.formEditQuestion['choice' + event.target.value[0]]) {
            stateCopy.choices.error.IsNullAnswerChoice = true;
            this.setState(stateCopy);
            return;
        }

        if (event.target.checked) {
            stateCopy['answer' + event.target.value[2]] = event.target.value[0];
            stateCopy.choices.error.IsNullAnswerChoice = false;
        }
        else stateCopy['answer' + event.target.value[2]] = ""

        this.setState(stateCopy);
    }

    setTFAnswer = (event) => {
        var stateCopy = this.state.formEditQuestion
        stateCopy['answer1'] = event.target.value
        this.setState(stateCopy)
    }

    setType = (type) => {
        this.setState({
            formEditQuestion: {
                ...this.state.formEditQuestion,
                question: this.state.formEditQuestion.question,
                questionType: type,
                answer1: '',
                answer2: '',
                answer3: '',
                answer4: '',
                answer5: '',
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
        if (!this.state.formEditQuestion.answer1) isNullAnswer = true;
        for (let i = 0; i < this.state.numberOfChoices; i++) {
            if (this.state.formEditQuestion['choice' + this.alphabet[i]]) numberOfChoices += 1;
            if (numberOfChoices >= 2) {
                isNullChoice = false;
            }
        }
        var stateCopy = this.state.formEditQuestion;
        stateCopy.choices.error.isNullAnswer = isNullAnswer ? true : false;
        stateCopy.choices.error.isNullChoice = isNullChoice ? true : false;
        this.setState(stateCopy);
        return isNullAnswer || isNullChoice;
    }

    validateMAQuestion = () => {
        var numberOfChoices = 0;
        var isNullAnswer = true;
        var isNullChoice = true;
        for (let i = 0; i < this.state.numberOfChoices; i++) {
            if (this.state.formEditQuestion['answer' + (i + 1)]) isNullAnswer = false;
            if (this.state.formEditQuestion['choice' + this.alphabet[i]]) numberOfChoices += 1;
            if (numberOfChoices >= 2) {
                isNullChoice = false;
            }
        }
        var stateCopy = this.state.formEditQuestion;
        stateCopy.choices.error.isNullAnswer = isNullAnswer ? true : false;
        stateCopy.choices.error.isNullChoice = isNullChoice ? true : false;
        this.setState(stateCopy);
        return isNullAnswer || isNullChoice;
    }

    validateTFQuestion = () => {
        var isNullAnswer = false;
        if (!this.state.formEditQuestion.answer1) isNullAnswer = true
        var stateCopy = this.state.formEditQuestion;
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
        // if (input.name.includes("choice") && this.state.formEditQuestion.questionType == "MC") this.validateMCQuestion()
        // else if (input.name.includes("choice") && this.state.formEditQuestion.questionType == "MA") this.validateMAQuestion()
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
            "question": this.state.formEditQuestion.question,
            "questionType": this.state.formEditQuestion.questionType,
        };
        switch (this.state.formEditQuestion.questionType) {
            case "MC":
                var numOfEnteredChoices = 0;
                var numOfEnteredAnswers = 0;
                for (let i = 0; i < this.state.numberOfChoices; i++) {
                    if (this.state.formEditQuestion['choice' + this.alphabet[i]]) {
                        payload['choice' + this.alphabet[numOfEnteredChoices]] = this.state.formEditQuestion['choice' + this.alphabet[i]];
                        numOfEnteredChoices += 1;
                    }
                    if (this.state.formEditQuestion['answer' + (i + 1)]) {
                        numOfEnteredAnswers += 1;
                        payload['answer' + numOfEnteredAnswers] = this.state.formEditQuestion['answer' + numOfEnteredAnswers];
                    }
                }
                break;
            case "MA":
                var numOfEnteredChoices = 0;
                var numOfEnteredAnswers = 0;
                for (let i = 0; i < this.state.numberOfChoices; i++) {
                    if (this.state.formEditQuestion['choice' + this.alphabet[i]]) {
                        payload['choice' + this.alphabet[numOfEnteredChoices]] = this.state.formEditQuestion['choice' + this.alphabet[i]];
                        numOfEnteredChoices += 1;
                    }
                    if (this.state.formEditQuestion['answer' + (i + 1)]) {
                        numOfEnteredAnswers += 1;
                        payload['answer' + numOfEnteredAnswers] = this.state.formEditQuestion['answer' + (i + 1)];
                    }
                }
                break;
            case "TF":
                payload.answer1 = this.state.formEditQuestion.answer1.toUpperCase()
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
        if (this.state.formEditQuestion.questionType == "MC") invalidQuestion = this.validateMCQuestion();
        else if (this.state.formEditQuestion.questionType == "MA") invalidQuestion = this.validateMAQuestion();
        else if (this.state.formEditQuestion.questionType == "TF") invalidQuestion = this.validateTFQuestion();

        console.log((hasError || invalidQuestion) ? 'Form has errors. Check!' : 'Form Submitted!')

        if (!hasError && !invalidQuestion) {
            var result = editAnswerKey(this.props.podId, this.props.courseId, this.props.assignmentId, this.props.questionId, this.constructRequestPayload());
            if (result.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully edited question",
                    confirmButtonColor: swalConfirm(),
                    icon: "success",
                })
                var params = this.state.getAnswerKeysParams
                var res = getAnswerKeys(this.props.podId, this.props.courseId, this.props.assignmentId, params.page, params.size, params.sort)
                if (res.isSuccess) {
                    this.props.updateOnEdit(res)
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

    populateForm() {
        var stateCopy = this.state;
        var numberOfChoices = 0
        var res = getAnswerKey(this.props.podId, this.props.courseId, this.props.assignmentId, this.props.questionId)
        if (res.isSuccess) {
            for (let i = 0; i < 5; i++) {
                if (res.data["choice" + this.alphabet[i]]) numberOfChoices += 1;
            }
            stateCopy.numberOfChoices = numberOfChoices
            this.setState(stateCopy)
        }
        stateCopy = this.state.formEditQuestion;
        stateCopy.question = res.data.question;
        stateCopy.questionType = res.data.questionType;
        for (let i = 0; i < numberOfChoices; i++) {
            stateCopy["choice" + this.alphabet[i]] = res.data["choice" + this.alphabet[i]];
            if (res.data.questionType === "MA") {
                if (res.data["answer" + (i + 1)] == "A") stateCopy.answer1 = res.data["answer" + (i + 1)]
                else if (res.data["answer" + (i + 1)] == "B") stateCopy.answer2 = res.data["answer" + (i + 1)]
                else if (res.data["answer" + (i + 1)] == "C") stateCopy.answer3 = res.data["answer" + (i + 1)]
                else if (res.data["answer" + (i + 1)] == "D") stateCopy.answer4 = res.data["answer" + (i + 1)]
                else if (res.data["answer" + (i + 1)] == "E") stateCopy.answer5 = res.data["answer" + (i + 1)]
            }
            else stateCopy.answer1 = res.data.answer1
        }
        this.setState(stateCopy)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.modal !== prevProps.modal) {
            if (this.props.modal) this.populateForm()
            this.setState({ modal: this.props.modal })
        }
        if (this.props.questionId !== prevProps.questionId) {
            if (this.props.modal) this.populateForm()
        }
    }

    render() {
        console.log(this.state.formEditQuestion)
        if (this.state.formEditQuestion.questionType == "MA") {
            var answerList = [];
            for (let i = 0; i < this.state.numberOfChoices; i++) {
                if (this.state.formEditQuestion['answer' + (i + 1)]) answerList.push(this.state.formEditQuestion['answer' + (i + 1)])
            }
        }
        return (
            <div>
                <Modal isOpen={this.state.modal}>
                    <form className="mb-3" name="formEditQuestion" onSubmit={this.onSubmit}>
                        <ModalHeader toggle={this.toggleModal}>Edit Question {this.props.questionNumber}</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="addCourseSubject">Question Type</label>
                                <QuestionTypeSelector
                                    name="typeSelector"
                                    defaultV={this.state.formEditQuestion.questionType}
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
                                        className="border-right-0 no-resize"
                                        placeholder="Enter question"
                                        invalid={
                                            this.hasError('formEditQuestion', 'question', 'required')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required"]'
                                        value={this.state.formEditQuestion.question || ''} 
                                        rows={5}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    {this.state.formEditQuestion.choices.error.isNullAnswer &&
                                        this.state.formEditQuestion.questionType != "TF" && <span style={errorMessageStyling()}>You must select at least 1 correct answer</span>}
                                    {this.hasError('formEditQuestion', 'question', 'required') && <span className="invalid-feedback">Question is required</span>}
                                </div>
                            </div>
                            {this.state.formEditQuestion.questionType === "MC" ?
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
                                                    invalid={this.state.formEditQuestion.choices.error.isNullChoice}
                                                    onChange={(event) => {
                                                        this.validateOnChange(event)
                                                        if (this.state.formEditQuestion.choices.error.isNullChoice) this.validateMCQuestion()
                                                    }}
                                                    value={this.state.formEditQuestion['choice' + e] || ''} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.state.formEditQuestion.choices.error.isNullChoice && <span style={errorMessageStyling()}>Two choices are required</span>}
                                                {this.state.formEditQuestion.choices.error.IsNullAnswerChoice && <span style={errorMessageStyling()}>Can't set answer for an empty choice</span>}
                                                {this.state.formEditQuestion['answer1'] === e ?
                                                    <div className="input-group">
                                                        <input className="mr-2" type="radio" value={e} name="answer" id={e} defaultChecked onChange={(event) => {
                                                            this.setMCAnswer(event)
                                                            this.validateMCQuestion()
                                                        }} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div> :
                                                    <div className="input-group">
                                                        <input className="mr-2" type="radio" value={e} name="answer" id={e} onChange={(event) => {
                                                            this.setMCAnswer(event)
                                                            this.validateMCQuestion()
                                                        }} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div>
                                                }
                                            </div>
                                        </div>)
                                })
                                : null}
                            {this.state.formEditQuestion.questionType === "MA" ?
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
                                                    invalid={this.state.formEditQuestion.choices.error.isNullChoice}
                                                    onChange={(event) => {
                                                        this.validateOnChange(event)
                                                        if (this.state.formEditQuestion.choices.error.isNullChoice) this.validateMAQuestion()
                                                    }}
                                                    value={this.state.formEditQuestion['choice' + e] || ''} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.state.formEditQuestion.choices.error.isNullChoice && <span style={errorMessageStyling()}>Two choices are required</span>}
                                                {this.state.formEditQuestion.choices.error.IsNullAnswerChoice && <span style={errorMessageStyling()}>Answer for an empty choice won't be saved</span>}
                                                {answerList.includes(e) ?
                                                    <div className="input-group">
                                                        <input className="mr-2" type="checkbox" value={[e, i]} id={e} name="answer" defaultChecked onChange={this.setMAAnswer} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div> :
                                                    <div className="input-group">
                                                        <input className="mr-2" type="checkbox" value={[e, i]} name="answer" onChange={this.setMAAnswer} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div>
                                                }
                                            </div>
                                        </div>)
                                })
                                : null}
                            {this.state.numberOfChoices < 5 && this.state.formEditQuestion.questionType != "TF" ?
                                <div>
                                    <Button className="btn btn-secondary btn-sm" style={{ marginLeft: "40%" }} onClick={this.addChoice}>Add Choice</Button>
                                </div>
                                : null}
                            {this.state.formEditQuestion.questionType === "TF" ?
                                <div className="input-group">
                                    {this.state.formEditQuestion['answer1'] === 'A' ?
                                        <div>
                                            <input className="mr-2" type="radio" value="A" name="answer" defaultChecked onChange={this.setTFAnswer} />
                                            <label className="text-muted pt-2">True</label>
                                        </div>
                                        :
                                        <div>
                                            <input className="mr-2" type="radio" value="A" name="answer" onChange={this.setTFAnswer} />
                                            <label className="text-muted pt-2">True</label>
                                        </div>}
                                    {this.state.formEditQuestion['answer1'] === 'B' ?
                                        <div>
                                            <input className="mr-2 ml-2" type="radio" value="B" name="answer" defaultChecked onChange={this.setTFAnswer} />
                                            <label className="text-muted pt-2">False</label>
                                            {this.state.formEditQuestion.choices.error.isNullAnswer && <span style={errorMessageStyling()}>Answer is required</span>}
                                        </div>
                                        :
                                        <div>
                                            <input className="mr-2 ml-2" type="radio" value="B" name="answer" onChange={this.setTFAnswer} />
                                            <label className="text-muted pt-2">False</label>
                                            {this.state.formEditQuestion.choices.error.isNullAnswer && <span style={errorMessageStyling()}>Answer is required</span>}
                                        </div>
                                    }
                                </div>
                                : null}

                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                            <Button color="primary" type="submit">Save</Button>{' '}
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default withRouter(editQuestionForm)