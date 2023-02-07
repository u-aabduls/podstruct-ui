import React, { Component } from 'react';
import { withRouter } from 'react-router';
import {
    Button,
    Input,
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
            return;
        }
        stateCopy['answer1'] = event.target.value;
        this.setState(stateCopy);
        this.validateMCQuestion();
    }

    setMAAnswer = (event) => {
        var stateCopy = this.state.formEditQuestion;
        // don't allow assigning answer if empty choice
        if (!this.state.formEditQuestion['choice' + event.target.attributes.element.value]) {
            return;
        }
        if (event.target.checked) {
            stateCopy['answer' + event.target.attributes.index.value] = event.target.value;
        }
        else stateCopy['answer' + event.target.attributes.index.value] = ""

        this.setState(stateCopy);
    }

    setTFAnswer = (event) => {
        var stateCopy = this.state.formEditQuestion
        stateCopy['answer1'] = event.target.value
        this.setState(stateCopy)
        this.validateTFQuestion();
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

    updateAnswer = (event, element, index, callback) => {
        if (event.target.value) {
            this.setState({
                ...this.state,
                ['choice' + element]: event.target.value,
                formEditQuestion: {
                    ...this.state.formEditQuestion,
                    ['choice' + element]: event.target.value,
                    ['answer' + index]: event.target.value
                },
            }, callback);
        }
        else {
            this.setState({
                ...this.state,
                ['choice' + element]: event.target.value,
                formEditQuestion: {
                    ...this.state.formEditQuestion,
                    ['choice' + element]: event.target.value,
                    ['answer' + index]: event.target.value,
                    ['answerAlpha' + index]: ''
                },
            }, callback);
        }
    }

    validateMCQuestion = () => {
        var numberOfChoices = 0;
        var isNullAnswer = false;
        var isNullChoice = true;
        var isNullAnswerChoice = false;

        if (!this.state.formEditQuestion.answer1) isNullAnswer = true;
        for (let i = 0; i < this.state.numberOfChoices; i++) {
            if (this.state.formEditQuestion['choice' + this.alphabet[i]]) numberOfChoices += 1;
            if (document.getElementById('answer' + (i + 1))?.checked && !this.state.formEditQuestion['choice' + this.alphabet[i]]) isNullAnswerChoice = true;
            if (numberOfChoices >= 2) {
                isNullChoice = false;
            }
        }
        var stateCopy = this.state.formEditQuestion;
        stateCopy.choices.error.isNullAnswer = isNullAnswer ? true : false;
        stateCopy.choices.error.isNullChoice = isNullChoice ? true : false;
        stateCopy.choices.error.isNullAnswerChoice = isNullAnswerChoice ? true : false;
        this.setState(stateCopy);
        return isNullAnswer || isNullChoice || isNullAnswerChoice;
    }

    validateMAQuestion = () => {
        var numberOfChoices = 0;
        var isNullAnswer = true;
        var isNullChoice = true;
        var isNullAnswerChoice = false;

        for (let i = 0; i < this.state.numberOfChoices; i++) {
            if (this.state.formEditQuestion['answer' + (i + 1)]) isNullAnswer = false;
            if (this.state.formEditQuestion['choice' + this.alphabet[i]]) numberOfChoices += 1;
            if (document.getElementById('answer' + (i + 1))?.checked && !this.state.formEditQuestion['choice' + this.alphabet[i]]) isNullAnswerChoice = true;
            if (numberOfChoices >= 2) {
                isNullChoice = false;
            }
        }
        var stateCopy = this.state.formEditQuestion;
        stateCopy.choices.error.isNullAnswer = isNullAnswer ? true : false;
        stateCopy.choices.error.isNullChoice = isNullChoice ? true : false;
        stateCopy.choices.error.isNullAnswerChoice = isNullAnswerChoice ? true : false;
        this.setState(stateCopy);
        return isNullAnswer || isNullChoice || isNullAnswerChoice;
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
    validateOnChange = (event, callback) => {
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
        }, callback);
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
        var numOfEnteredChoices = 0;
        var numOfEnteredAnswers = 0;
        switch (this.state.formEditQuestion.questionType) {
            case "MC":
                numOfEnteredChoices = 0;
                numOfEnteredAnswers = 0;
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
                numOfEnteredChoices = 0;
                numOfEnteredAnswers = 0;
                for (let i = 0; i < this.state.numberOfChoices; i++) {
                    if (this.state.formEditQuestion['choice' + this.alphabet[i]]) {
                        payload['choice' + this.alphabet[numOfEnteredChoices]] = this.state.formEditQuestion['choice' + this.alphabet[i]];
                        numOfEnteredChoices += 1;
                    }
                }
                for (let i = 0; i < numOfEnteredChoices; i++) {
                    for (let j = 0; j < this.state.numberOfChoices; j++) {
                        if (this.state.formEditQuestion['answer' + (j + 1)] && this.state.formEditQuestion['answer' + (j + 1)] === payload['choice' + this.alphabet[i]]) {
                            numOfEnteredAnswers += 1;
                            payload['answer' + numOfEnteredAnswers] = this.alphabet[i];
                        }
                    }
                }
                break;
            case "TF":
                payload.answer1 = this.state.formEditQuestion.answer1
                payload.choiceA = "True"
                payload.choiceB = "False"
                break;
            default:
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
        if (this.state.formEditQuestion.questionType === "MC") invalidQuestion = this.validateMCQuestion();
        else if (this.state.formEditQuestion.questionType === "MA") invalidQuestion = this.validateMAQuestion();
        else if (this.state.formEditQuestion.questionType === "TF") invalidQuestion = this.validateTFQuestion();

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
        var answerCount = 1;
        for (let i = 0; i < numberOfChoices; i++) {
            stateCopy["choice" + this.alphabet[i]] = res.data["choice" + this.alphabet[i]];
            if (res.data.questionType === "MA") {
                if (res.data["answer" + (i + 1)]) {
                    stateCopy['answerAlpha' + answerCount] = res.data["answer" + (i + 1)];
                    stateCopy['answer' + (this.alphabet.indexOf(res.data["answer" + (i + 1)]) + 1)] = res.data["choice" + res.data["answer" + (i + 1)]];
                    answerCount++;
                }
            }
            else stateCopy.answer1 = res.data.answer1
        }
        this.setState(stateCopy)
    }

    clearForm() {
        this.setState({
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
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.modal !== prevProps.modal) {
            if (this.props.modal) this.populateForm()
            else this.clearForm();
            this.setState({ modal: this.props.modal })
        }
        if (this.props.questionId !== prevProps.questionId) {
            if (this.props.modal) this.populateForm()
        }
    }

    render() {
        console.log(this.state.formEditQuestion)
        if (this.state.formEditQuestion.questionType === "MA") {
            var answerList = [];
            for (let i = 0; i < this.state.numberOfChoices; i++) {
                if (this.state.formEditQuestion['answerAlpha' + (i + 1)]) answerList.push(this.state.formEditQuestion['answerAlpha' + (i + 1)])
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
                                    assignmentType={this.props.assignmentType}
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
                                        this.state.formEditQuestion.questionType !== "TF" && <span style={errorMessageStyling()}>You must select at least 1 correct answer</span>}
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
                                                        this.validateOnChange(event, () => {
                                                            if (Object.values(this.state.formEditQuestion.choices.error).includes(true)) this.validateMCQuestion()
                                                        })
                                                        if (document.getElementById('answer' + i).checked) this.updateAnswer(event, e, 1, () => {
                                                            if (Object.values(this.state.formEditQuestion.choices.error).includes(true)) this.validateMCQuestion()
                                                        })
                                                    }}
                                                    value={this.state.formEditQuestion['choice' + e] || ''} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.state.formEditQuestion.choices.error.isNullChoice && <span style={errorMessageStyling()}>Two choices are required</span>}
                                                {this.state.formEditQuestion.choices.error.IsNullAnswerChoice && <span style={errorMessageStyling()}>Can't set answer for an empty choice</span>}
                                                {!this.state.formEditQuestion['choice' + e] ?
                                                    <div className="input-group">
                                                        <input disabled checked={false} className="mr-2" type="radio" value={e} id={'answer' + i} name="answer" onChange={(event) => {
                                                            this.setMCAnswer(event)
                                                            this.validateMCQuestion()
                                                        }} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div>
                                                    :
                                                    <>
                                                        {this.state.formEditQuestion['answer1'] === e ?
                                                            <div className="input-group">
                                                                <input className="mr-2" type="radio" value={e} id={'answer' + i} name="answer" defaultChecked onChange={(event) => {
                                                                    this.setMCAnswer(event)
                                                                    this.validateMCQuestion()
                                                                }} />
                                                                <label className="text-muted pt-2">Correct Answer3</label>
                                                            </div> :
                                                            <div className="input-group">
                                                                <input className="mr-2" type="radio" value={e} id={'answer' + i} name="answer" onChange={(event) => {
                                                                    this.setMCAnswer(event)
                                                                    this.validateMCQuestion()
                                                                }} />
                                                                <label className="text-muted pt-2">Correct Answer2</label>
                                                            </div>
                                                        }
                                                    </>
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
                                                        this.validateOnChange(event, () => {
                                                            if (Object.values(this.state.formEditQuestion.choices.error).includes(true)) this.validateMAQuestion()
                                                        })
                                                        if (document.getElementById('answer' + i).checked) this.updateAnswer(event, e, i, () => {
                                                            if (Object.values(this.state.formEditQuestion.choices.error).includes(true)) this.validateMAQuestion()
                                                        })
                                                    }}
                                                    value={this.state.formEditQuestion['choice' + e] || ''} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.state.formEditQuestion.choices.error.isNullChoice && <span style={errorMessageStyling()}>Two choices are required</span>}
                                                {this.state.formEditQuestion.choices.error.IsNullAnswerChoice && <span style={errorMessageStyling()}>Answer for an empty choice won't be saved</span>}
                                                {!this.state.formEditQuestion['choice' + e] ?
                                                    <div className="input-group">
                                                        <input disabled checked={false} className="mr-2" type="checkbox" element={e} index={i} value={this.state.formEditQuestion["choice" + e]} id={'answer' + i} name="answer" defaultChecked onChange={(event) => {
                                                            this.setMAAnswer(event)
                                                            this.validateMAQuestion()
                                                        }} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div>
                                                    :
                                                    <>
                                                        {answerList.includes(e) ?
                                                            <div className="input-group">
                                                                <input className="mr-2" type="checkbox" element={e} index={i} value={this.state.formEditQuestion["choice" + e]} id={'answer' + i} name="answer" defaultChecked onChange={(event) => {
                                                                    this.setMAAnswer(event)
                                                                    this.validateMAQuestion()
                                                                }} />
                                                                <label className="text-muted pt-2">Correct Answer</label>
                                                            </div> :
                                                            <div className="input-group">
                                                                <input className="mr-2" type="checkbox" element={e} index={i} value={this.state.formEditQuestion["choice" + e]} id={'answer' + i} name="answer" onChange={(event) => {
                                                                    this.setMAAnswer(event)
                                                                    this.validateMAQuestion()
                                                                }} />
                                                                <label className="text-muted pt-2">Correct Answer</label>
                                                            </div>
                                                        }
                                                    </>
                                                }
                                            </div>
                                        </div>)
                                })
                                : null}
                            {this.state.numberOfChoices < 5 && this.state.formEditQuestion.questionType !== "TF" && this.state.formEditQuestion.questionType !== "FF" ?
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
                        <ModalFooter style={{ paddingBottom: '0' }}>
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                            <Button
                                color="primary"
                                type="submit"
                                onMouseDown={e => e.preventDefault()}
                            >
                                Save
                            </Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default withRouter(editQuestionForm)