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
import { createAnswerKey, getAnswerKeys } from '../../../connectors/AnswerKey';
import QuestionTypeSelector from '../../Common/QuestionTypeSelector';
import FormValidator from '../FormValidator';
import { swalConfirm, dangerText, errorMessageStyling } from '../../../utils/Styles';

class AddQuestionForm extends Component {

    state = {
        formAddQuestion: {
            question: '',
            questionType: 'MC',
            choices: {
                error: {
                    isNullAnswer: false,
                    isNullChoice: false,
                }
            }
        },
        numberOfChoices: 2,
        modal: false,
        getAnswerKeysParams: this.props.answerKeyParams,
    }

    alphabet = ["A", "B", "C", "D", "E"];

    toggleModal = () => {
        this.setState({
            formAddQuestion: {
                question: '',
                questionType: 'MC',
                choices: {
                    error: {
                        isNullAnswer: false,
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
            return;
        }
        stateCopy['answer1'] = event.target.value;
        this.setState(stateCopy);
    }

    setMAAnswer = (event) => {
        var stateCopy = this.state.formAddQuestion;
        // don't allow assigning answer if empty choice
        if (!this.state.formAddQuestion['choice' + event.target.attributes.element.value]) {
            return;
        }
        if (event.target.checked) {
            stateCopy['answer' + event.target.attributes.index.value] = event.target.value;
        }
        else stateCopy['answer' + event.target.attributes.index.value] = ""

        this.setState(stateCopy);
    }

    setTFAnswer = (event) => {
        var stateCopy = this.state.formAddQuestion
        stateCopy['answer1'] = event.target.value
        this.setState(stateCopy)
        this.validateTFQuestion();
    }

    setType = (type) => {
        this.setState({
            formAddQuestion: {
                question: this.state.formAddQuestion.question,
                questionType: type,
                choices: {
                    error: {
                        isNullAnswer: false,
                        isNullChoice: false,
                    }
                }
            },
        })
    }

    updateAnswer = (event, element, index, callback) => {
        this.setState({
            ...this.state,
            ['choice' + element]: event.target.value,
            formAddQuestion: {
                ...this.state.formAddQuestion,
                ['choice' + element]: event.target.value,
                ['answer' + index]: event.target.value
            },
        }, callback);
    }

    validateMCQuestion = (event) => {
        var numberOfChoices = 0;
        var isNullAnswer = false;
        var isNullChoice = true;

        if (!this.state.formAddQuestion.answer1) isNullAnswer = true;
        for (let i = 0; i < this.state.numberOfChoices; i++) {
            if (event?.target.checked){
                isNullChoice = false;
                break;
            }
            if (this.state.formAddQuestion['choice' + this.alphabet[i]]) numberOfChoices += 1;
            if (numberOfChoices >= 2) {
                isNullChoice = false;
            }
        }
        var stateCopy = this.state.formAddQuestion;
        stateCopy.choices.error.isNullAnswer = isNullAnswer ? true : false;
        stateCopy.choices.error.isNullChoice = isNullChoice ? true : false;
        this.setState(stateCopy);
        return isNullAnswer || isNullChoice;
    }

    validateMAQuestion = (event) => {
        var numberOfChoices = 0;
        var isNullAnswer = true;
        var isNullChoice = true;

        for (let i = 0; i < this.state.numberOfChoices; i++) {
            // if valide was triggerd by checkbox, both answer and choice are no longer null
            if (event?.target.checked){
                isNullAnswer = false;
                isNullChoice = false;
                break;
            }
            if (this.state.formAddQuestion['answer' + (i + 1)]) isNullAnswer = false;
            if (this.state.formAddQuestion['choice' + this.alphabet[i]]) numberOfChoices += 1;
            if (numberOfChoices >= 2) {
                isNullChoice = false;
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
            "question": this.state.formAddQuestion.question,
            "questionType": this.state.formAddQuestion.questionType,
        };
        var numOfEnteredChoices = 0;
        var numOfEnteredAnswers = 0;
        switch (this.state.formAddQuestion.questionType) {
            case "MC":
                numOfEnteredChoices = 0;
                numOfEnteredAnswers = 0;
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
                numOfEnteredChoices = 0;
                numOfEnteredAnswers = 0;
                for (let i = 0; i < this.state.numberOfChoices; i++) {
                    if (this.state.formAddQuestion['choice' + this.alphabet[i]]) {
                        payload['choice' + this.alphabet[numOfEnteredChoices]] = this.state.formAddQuestion['choice' + this.alphabet[i]];
                        numOfEnteredChoices += 1;
                    }
                }
                for (let i = 0; i < numOfEnteredChoices; i++) {
                    for (let j = 0; j < this.state.numberOfChoices; j++) {
                        if (this.state.formAddQuestion['answer' + (j + 1)]
                            && this.state.formAddQuestion['answer' + (j + 1)] === payload['choice' + this.alphabet[i]]) {
                            numOfEnteredAnswers += 1;
                            payload['answer' + numOfEnteredAnswers] = this.alphabet[i];
                        }
                    }
                }
                break;
            case "TF":
                payload.answer1 = this.state.formAddQuestion.answer1
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
        if (this.state.formAddQuestion.questionType === "MC") invalidQuestion = this.validateMCQuestion();
        else if (this.state.formAddQuestion.questionType === "MA") invalidQuestion = this.validateMAQuestion();
        else if (this.state.formAddQuestion.questionType === "TF") invalidQuestion = this.validateTFQuestion();

        console.log((hasError || invalidQuestion) ? 'Form has errors. Check!' : 'Form Submitted!')

        if (!hasError && !invalidQuestion) {
            var result = createAnswerKey(this.props.podId, this.props.courseId, this.props.assignmentId, this.constructRequestPayload());
            if (result.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully created question",
                    confirmButtonColor: swalConfirm(),
                    icon: "success",
                })
                var params = this.state.getAnswerKeysParams
                var res = getAnswerKeys(this.props.podId, this.props.courseId, this.props.assignmentId, params.page, params.size, params.sort)
                if (res.isSuccess) {
                    this.props.updateOnAdd(res)
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
                                    assignmentType={this.props.assignmentType}
                                    defaultV={this.state.formAddQuestion.questionType}
                                    setType={(type) => this.setType(type)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="id-question">Question <span style={dangerText()}>*</span></label>
                                <div className="input-group with-focus">
                                    <Input
                                        type="textarea"
                                        id="id-question"
                                        name="question"
                                        className="border-right-0 no-resize"
                                        invalid={
                                            this.hasError('formAddQuestion', 'question', 'required')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required"]'
                                        value={this.state.formAddQuestion.question || ''}
                                        rows={5}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    {this.state.formAddQuestion.choices.error.isNullAnswer &&
                                        this.state.formAddQuestion.questionType !== "TF" && <span style={errorMessageStyling()}>You must select at least 1 correct answer</span>}
                                    {this.hasError('formAddQuestion', 'question', 'required') && <span className="invalid-feedback">Question is required</span>}
                                </div>
                            </div>
                            {this.state.formAddQuestion.questionType === "MC" ?
                                Array.from({ length: this.state.numberOfChoices }, (_, i) => this.alphabet[i]).map((e, i) => {
                                    i = i + 1;
                                    return (
                                        <div className="form-group">
                                            <label className="text-muted" htmlFor={"id-Choice" + i}>Choice {e} <span style={dangerText()}>*</span></label>
                                            <div className="input-group with-focus">
                                                <Input
                                                    type="text"
                                                    id={"id-Choice" + e}
                                                    name={"choice" + e}
                                                    className="border-right-0"
                                                    placeholder="Enter a possible answer for the question"
                                                    invalid={this.state.formAddQuestion.choices.error.isNullChoice}
                                                    onChange={(event) => {
                                                        this.validateOnChange(event, () => {
                                                            if (Object.values(this.state.formAddQuestion.choices.error).includes(true)) this.validateMCQuestion(event)
                                                        })
                                                        if (document.getElementById('answer' + i).checked) this.updateAnswer(event, e, 1, () => {
                                                            if (Object.values(this.state.formAddQuestion.choices.error).includes(true)) this.validateMCQuestion(event)
                                                        })
                                                    }}
                                                    value={this.state.formAddQuestion['choice' + e] || ''} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.state.formAddQuestion.choices.error.isNullChoice && <span style={errorMessageStyling()}>Two choices are required</span>}
                                                {this.state.formAddQuestion['choice' + e] ?
                                                    <div className="input-group">
                                                        <input className="mr-2" type="radio" value={e} id={'answer' + i} name="answer" onChange={(event) => {
                                                            this.setMCAnswer(event)
                                                            this.validateMCQuestion(event)
                                                        }} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div>
                                                    :
                                                    <div className="input-group">
                                                        <input disabled checked={false} className="mr-2" type="radio" value={e} id={'answer' + i} name="answer" onChange={(event) => {
                                                            this.setMCAnswer(event)
                                                            this.validateMCQuestion(event)
                                                        }} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div>}

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
                                                        this.validateOnChange(event, () => {
                                                            if (Object.values(this.state.formAddQuestion.choices.error).includes(true)) this.validateMAQuestion(event)
                                                        })
                                                        if (document.getElementById('answer' + i).checked) this.updateAnswer(event, e, i, () => {
                                                            if (Object.values(this.state.formAddQuestion.choices.error).includes(true)) this.validateMAQuestion(event)
                                                        })
                                                    }}
                                                    value={this.state.formAddQuestion['choice' + e] || ''} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.state.formAddQuestion.choices.error.isNullChoice && <span style={errorMessageStyling()}>Two choices are required</span>}
                                                {this.state.formAddQuestion['choice' + e] ?
                                                    <div className="input-group">
                                                        <input className="mr-2" type="checkbox" element={e} index={i} value={this.state.formAddQuestion["choice" + e]} id={'answer' + i} name={'answer' + i} onChange={(event) => {
                                                            this.setMAAnswer(event)
                                                            this.validateMAQuestion(event)
                                                        }} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div>
                                                    :
                                                    <div className="input-group">
                                                        <input disabled checked={false} className="mr-2" type="checkbox" element={e} index={i} value={this.state.formAddQuestion["choice" + e]} id={'answer' + i} name={'answer' + i} onChange={(event) => {
                                                            this.setMAAnswer(event)
                                                            this.validateMAQuestion(event)
                                                        }} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div>
                                                }
                                            </div>
                                        </div>)
                                })
                                : null}
                            {this.state.formAddQuestion.questionType === "TF" ?
                                <div className="input-group">
                                    <input className="mr-2" type="radio" value="A" name="answer" onChange={this.setTFAnswer} />
                                    <label className="text-muted pt-2">True</label>
                                    <input className="mr-2 ml-2" type="radio" value="B" name="answer" onChange={this.setTFAnswer} />
                                    <label className="text-muted pt-2">False</label>
                                    {this.state.formAddQuestion.choices.error.isNullAnswer && <span style={errorMessageStyling()}>Answer is required</span>}
                                </div>
                                : null}
                            {this.state.numberOfChoices < 5 && this.state.formAddQuestion.questionType !== "TF" && this.state.formAddQuestion.questionType !== "FF" ?
                                <div>
                                    <Button
                                        className="btn btn-secondary btn-sm"
                                        style={{ marginLeft: "40%" }}
                                        onClick={this.addChoice}
                                        onMouseDown={e => e.preventDefault()}
                                    >
                                        Add Choice
                                    </Button>
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
                                Add
                            </Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default withRouter(AddQuestionForm)