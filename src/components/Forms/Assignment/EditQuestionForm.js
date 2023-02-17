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
            choiceDict: {},
            answerDict: {},
            choices: {
                error: {
                    isNullAnswer: false,
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
        stateCopy.answerDict.answer1 = event.target.attributes.element.value;
        this.setState(stateCopy);
    }

    setMAAnswer = (event) => {
        var stateCopy = this.state.formEditQuestion;
        if (event.target.checked) {
            stateCopy.answerDict['answer' + event.target.attributes.index.value] = event.target.attributes.element.value;
        }
        else delete stateCopy.answerDict['answer' + event.target.attributes.index.value];

        this.setState(stateCopy);
    }

    setTFAnswer = (event) => {
        var stateCopy = this.state.formEditQuestion
        stateCopy.answerDict.answer1 = event.target.value
        this.setState(stateCopy)
        this.validateTFQuestion();
    }

    setType = (type) => {
        this.setState({
            formEditQuestion: {
                ...this.state.formEditQuestion,
                question: this.state.formEditQuestion.question,
                questionType: type,
                choiceDict: {},
                answerDict: {},
                choices: {
                    error: {
                        isNullAnswer: false,
                        isNullChoice: false,
                    }
                }
            },
        })
    }

    updateChoiceAndAnswer = (event, element, index, callback) => {
        var stateCopy = this.state.formEditQuestion
        if (event.target.value) {
            if (stateCopy.answerDict['answer' + index])
                if (document.getElementById('answer' + index).checked) stateCopy.answerDict['answer' + index] = event.target.value;
            stateCopy.choiceDict[element] = event.target.value;

        }
        else {
            if (stateCopy.answerDict['answer' + index]) delete stateCopy.answerDict['answer' + index];
            if (stateCopy.choiceDict[element]) delete stateCopy.choiceDict[element];
            this.setState(stateCopy, callback);
        }
    }

    validateMCMAQuestion = (event) => {
        var isNullAnswer = true;
        var isNullChoice = true;

        if (event?.target.checked) {
            isNullAnswer = false;
        }
        else if (Object.keys(this.state.formEditQuestion.answerDict).length !== 0) isNullAnswer = false;
        if (Object.keys(this.state.formEditQuestion.choiceDict).length >= 2) isNullChoice = false;

        var stateCopy = this.state.formEditQuestion;
        stateCopy.choices.error.isNullAnswer = isNullAnswer ? true : false;
        stateCopy.choices.error.isNullChoice = isNullChoice ? true : false;
        this.setState(stateCopy);
        return isNullAnswer || isNullChoice;
    }

    validateTFQuestion = () => {
        var isNullAnswer = false;
        if (!this.state.formEditQuestion.answerDict.answer1) isNullAnswer = true
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
        switch (this.state.formEditQuestion.questionType) {
            case "MC":
                for (let i = 0; i < Object.keys(this.state.formEditQuestion.choiceDict).length; i++) {
                    payload['choice' + this.alphabet[i]] = this.state.formEditQuestion.choiceDict[Object.keys(this.state.formEditQuestion.choiceDict)[i]];
                    if (this.state.formEditQuestion.choiceDict[Object.keys(this.state.formEditQuestion.choiceDict)[i]] === this.state.formEditQuestion.choiceDict[this.state.formEditQuestion.answerDict.answer1])
                        payload.answer1 = this.alphabet[i];
                }
                break;
            case "MA":
                var answerChoiceValues = [];
                var numberOfEnteredAnswers = 0;
                Object.values(this.state.formEditQuestion.answerDict).forEach((element) => {
                    answerChoiceValues.push(this.state.formEditQuestion.choiceDict[element])
                })
                for (let i = 0; i < Object.keys(this.state.formEditQuestion.choiceDict).length; i++) {
                    payload['choice' + this.alphabet[i]] = this.state.formEditQuestion.choiceDict[Object.keys(this.state.formEditQuestion.choiceDict)[i]];
                    if (answerChoiceValues.includes(this.state.formEditQuestion.choiceDict[Object.keys(this.state.formEditQuestion.choiceDict)[i]])){
                        payload['answer' + (numberOfEnteredAnswers + 1)] = this.alphabet[i];
                        numberOfEnteredAnswers++;
                    }     
                }
                break;
            case "TF":
                payload.answer1 = this.state.formEditQuestion.answerDict.answer1;
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
        if (this.state.formEditQuestion.questionType === "MC" || this.state.formEditQuestion.questionType === "MA") invalidQuestion = this.validateMCMAQuestion();
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
            if (numberOfChoices) stateCopy.numberOfChoices = numberOfChoices;
            else stateCopy.numberOfChoices = 2;
            this.setState(stateCopy)
        }
        stateCopy = this.state.formEditQuestion;
        stateCopy.question = res.data.question;
        stateCopy.questionType = res.data.questionType;
        for (let i = 0; i < numberOfChoices; i++) {
            stateCopy.choiceDict[this.alphabet[i]] = res.data["choice" + this.alphabet[i]];

        }
        for (let i = 0; i < numberOfChoices; i++) {
            if (res.data.questionType === "MA") {
                if (res.data["answer" + (i + 1)]) {
                    stateCopy.answerDict["answer" + (Object.keys(stateCopy.answerDict).length + 1)] = res.data["answer" + (i + 1)];
                }
            }
            else stateCopy.answerDict.answer1 = res.data.answer1;
        }
        this.setState(stateCopy)
    }

    clearForm() {
        this.setState({
            formEditQuestion: {
                question: '',
                questionType: '',
                choiceDict: {},
                answerDict: {},
                choices: {
                    error: {
                        isNullAnswer: false,
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
                                    {this.hasError('formEditQuestion', 'question', 'required') && <span className="invalid-feedback">Question is required</span>}
                                    {this.state.formEditQuestion.choices.error.isNullAnswer &&
                                        this.state.formEditQuestion.questionType !== "TF" && <span style={errorMessageStyling()}>You must select at least 1 correct answer</span>}
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
                                                    name={e}
                                                    className="border-right-0"
                                                    placeholder="Enter a possible answer for the question"
                                                    invalid={this.state.formEditQuestion.choices.error.isNullChoice}
                                                    onChange={(event) => {
                                                        this.validateOnChange(event, () => {
                                                            if (Object.values(this.state.formEditQuestion.choices.error).includes(true)) this.validateMCMAQuestion(event)
                                                        })
                                                        this.updateChoiceAndAnswer(event, e, 1, () => {
                                                            if (Object.values(this.state.formEditQuestion.choices.error).includes(true)) this.validateMCMAQuestion(event)
                                                        })
                                                    }}
                                                    value={this.state.formEditQuestion.choiceDict[e] || ''} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.state.formEditQuestion.choices.error.isNullChoice && <span style={errorMessageStyling()}>Two choices are required</span>}
                                                {!this.state.formEditQuestion.choiceDict[e] ?
                                                    <div className="input-group">
                                                        <input disabled checked={false} className="mr-2" type="radio" value={e} id={'answer' + i} name="answer" onChange={(event) => {
                                                            this.setMCAnswer(event)
                                                            this.validateMCMAQuestion(event)
                                                        }} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div>
                                                    :
                                                    <>
                                                        {this.state.formEditQuestion.answerDict.answer1 === e ?
                                                            <div className="input-group">
                                                                <input className="mr-2" type="radio" element={e} value={e} id={'answer' + i} name="answer" defaultChecked onChange={(event) => {
                                                                    this.setMCAnswer(event)
                                                                    this.validateMCMAQuestion(event)
                                                                }} />
                                                                <label className="text-muted pt-2">Correct Answer3</label>
                                                            </div> :
                                                            <div className="input-group">
                                                                <input className="mr-2" type="radio" element={e} value={e} id={'answer' + i} name="answer" onChange={(event) => {
                                                                    this.setMCAnswer(event)
                                                                    this.validateMCMAQuestion(event)
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
                                                    name={e}
                                                    className="border-right-0"
                                                    placeholder="Enter a possible answer for the question"
                                                    invalid={this.state.formEditQuestion.choices.error.isNullChoice}
                                                    onChange={(event) => {
                                                        this.validateOnChange(event, () => {
                                                            if (Object.values(this.state.formEditQuestion.choices.error).includes(true)) this.validateMCMAQuestion(event)
                                                        })
                                                        this.updateChoiceAndAnswer(event, e, i, () => {
                                                            if (Object.values(this.state.formEditQuestion.choices.error).includes(true)) this.validateMCMAQuestion(event)
                                                        })
                                                    }}
                                                    value={this.state.formEditQuestion.choiceDict[e] || ''} />
                                                <div className="input-group-append">
                                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                                        <em className="fa fa-book"></em>
                                                    </span>
                                                </div>
                                                {this.state.formEditQuestion.choices.error.isNullChoice && <span style={errorMessageStyling()}>Two choices are required</span>}
                                                {!this.state.formEditQuestion.choiceDict[e] ?
                                                    <div className="input-group">
                                                        <input disabled checked={false} className="mr-2" type="checkbox" element={e} index={i} value={this.state.formEditQuestion.choiceDict[e]} id={'answer' + i} name="answer" onChange={(event) => {
                                                            this.setMAAnswer(event)
                                                            this.validateMCMAQuestion(event)
                                                        }} />
                                                        <label className="text-muted pt-2">Correct Answer</label>
                                                    </div>
                                                    :
                                                    <>
                                                        {Object.values(this.state.formEditQuestion.answerDict).includes(e) ?
                                                            <div className="input-group">
                                                                <input className="mr-2" type="checkbox" element={e} index={i} value={this.state.formEditQuestion.choiceDict[e]} id={'answer' + i} name="answer" defaultChecked onChange={(event) => {
                                                                    this.setMAAnswer(event)
                                                                    this.validateMCMAQuestion(event)
                                                                }} />
                                                                <label className="text-muted pt-2">Correct Answer</label>
                                                            </div> :
                                                            <div className="input-group">
                                                                <input className="mr-2" type="checkbox" element={e} index={i} value={this.state.formEditQuestion.choiceDict[e]} id={'answer' + i} name="answer" onChange={(event) => {
                                                                    this.setMAAnswer(event)
                                                                    this.validateMCMAQuestion(event)
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
                                    {this.state.formEditQuestion.answerDict.answer1 === 'A' ?
                                        <div>
                                            <input className="mr-2" type="radio" value="A" name="answer" defaultChecked onChange={this.setTFAnswer} />
                                            <label className="text-muted pt-2">True</label>
                                        </div>
                                        :
                                        <div>
                                            <input className="mr-2" type="radio" value="A" name="answer" onChange={this.setTFAnswer} />
                                            <label className="text-muted pt-2">True</label>
                                        </div>}
                                    {this.state.formEditQuestion.answerDict.answer1 === 'B' ?
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