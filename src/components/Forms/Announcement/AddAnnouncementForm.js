import React, { Component } from 'react';
import {
    Button,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import { getPodAnnouncements, addPodAnnouncement, getCourseAnnouncements, addCourseAnnouncement } from '../../../connectors/Announcement';
import Swal from 'sweetalert2';
import FormValidator from '../FormValidator';

class AddAnnouncementForm extends Component {

    state = {
        formAddAnnouncement: {
            title: '',
            message: ''
        },
        course: this.props.course,
        pod: this.props.pod,
        modal: false,
    }

    toggleModal = () => {
        this.setState({
            formAddAnnouncement: {
                title: '',
                message: ''
            },
        });
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

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return this.state[formName] &&
            this.state[formName].errors &&
            this.state[formName].errors[inputName] &&
            this.state[formName].errors[inputName][method]
    }

    constructRequestPayload = () => {
        var payload = {
            "title": this.state.formAddAnnouncement.title
        };

        if (this.state.formAddAnnouncement.message) {
            payload.message = this.state.formAddAnnouncement.message
        }
        return JSON.stringify(payload);
    }

    onSubmit = e => {
        e.preventDefault();

        const form = e.target;

        const inputsToValidate = [
            'title',
            'message',
        ];

        const inputs = [...form.elements].filter(i => inputsToValidate.includes(i.name))

        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                errors
            }
        });

        console.log((hasError) ? 'Form has errors. Check!' : 'Form Submitted!')

        if (!hasError) {
            var res;
            this.state.course ?
                res = addCourseAnnouncement(this.state.course.podId, this.state.course.id, this.constructRequestPayload()) :
                res = addPodAnnouncement(this.state.pod.id, this.constructRequestPayload());
            if (res.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully added announcement",
                    icon: "success",
                })
                this.state.course ?
                    res = getCourseAnnouncements(this.state.course.podId, this.state.course.id, '', 0) :
                    res = getPodAnnouncements(this.state.pod.id, '', 0);
                this.props.updateOnAdd(res)
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

    componentDidUpdate(prevProps) {
        if (this.props.modal !== prevProps.modal) {
            this.setState({ modal: this.props.modal })
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal}>
                <form className="mb-3" name="formAddAnnouncement" onSubmit={this.onSubmit}>
                    <ModalHeader toggle={this.toggleModal}>Add Announcement</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-announcementTitle">Title</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-announcementTitle"
                                    name="title"
                                    className="border-right-0"
                                    placeholder="Announcement title"
                                    invalid={
                                        this.hasError('formAddAnnouncement', 'title', 'required')
                                        || this.hasError('formAddAnnouncement', 'title', 'len')
                                        || this.hasError('formAddAnnouncement', 'title', 'contains-alpha')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["required", "len", "contains-alpha"]'
                                    data-param='[3, 100]'
                                    value={this.state.formAddAnnouncement.title} />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formAddAnnouncement', 'title', 'required') && <span className="invalid-feedback">Title is required</span>}
                                {this.hasError('formAddAnnouncement', 'title', 'len') && <span className="invalid-feedback">Title must be between 3 and 100 characters in length</span>}
                                {this.hasError('formAddAnnouncement', 'title', 'contains-alpha') && <span className="invalid-feedback">Title must contain at least one alpha character</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-announcementMessage">Message</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-announcementMessage"
                                    name="message"
                                    className="border-right-0"
                                    placeholder="Announcement message"
                                    invalid={
                                        this.hasError('formAddAnnouncement', 'message', 'maxlen')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["maxlen"]'
                                    data-param='50'
                                    value={this.state.formAddAnnouncement.message} />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formAddAnnouncement', 'message', 'maxlen') && <span className="invalid-feedback">Message must not have more than 50 characters</span>}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        <Button color="primary" type="submit">Add</Button>{' '}
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}

export default AddAnnouncementForm