import React, { Component } from 'react';
import {
    Button,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import {
    getPodAnnouncements,
    updatePodAnnouncement,
    getCourseAnnouncements,
    updateCourseAnnouncement
} from '../../../connectors/Announcement';
import Swal from 'sweetalert2';
import FormValidator from '../FormValidator';
import { swalConfirm } from '../../../utils/Styles';

class EditAnnouncementForm extends Component {

    state = {
        formEditAnnouncement: {
            title: this.props.announcement.title,
            message: this.props.announcement.message
        },
        course: this.props.course,
        pod: this.props.pod,
        modal: false,
        announcement: this.props.announcement
    }

    toggleModal = () => {
        this.setState({
            formEditAnnouncement: {
                title: '',
                message: ''
            }
        });
        this.props.toggle('');
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
            "title": this.state.formEditAnnouncement.title
        };

        if (this.state.formEditAnnouncement.message) {
            payload.message = this.state.formEditAnnouncement.message;
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
            res = this.state.course ?
                updateCourseAnnouncement(this.state.course.podId, this.state.course.id, this.state.announcement.date, this.constructRequestPayload()) :
                updatePodAnnouncement(this.state.pod.id, this.state.announcement.date, this.constructRequestPayload());

            this.toggleModal();
            if (res.isSuccess) {
                Swal.fire({
                    title: "Successfully edited announcement",
                    confirmButtonColor: swalConfirm(),
                    icon: "success",
                });
                res = this.state.course ?
                    getCourseAnnouncements(this.state.course.podId, this.state.course.id, '', 0) :
                    getPodAnnouncements(this.state.pod.id, '', 0);
                this.props.updateOnEdit(res);
            }
            else {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    confirmButtonColor: swalConfirm(),
                    text: res.message
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.modal !== prevProps.modal) {
            this.setState({ modal: this.props.modal });
        }
        if (this.props.announcement && this.props.announcement !== prevProps.announcement) {
            this.setState(
                {
                    announcement: this.props.announcement,
                    formEditAnnouncement: {
                        title: this.props.announcement.title,
                        message: this.props.announcement.message
                    }
                }
            );
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal}>
                <form className="mb-3" name="formEditAnnouncement" onSubmit={this.onSubmit}>
                    <ModalHeader toggle={this.toggleModal}>Edit Announcement</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-announcementTitle">Title</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-announcementTitle"
                                    name="title"
                                    className="border-right-0"
                                    invalid={
                                        this.hasError('formEditAnnouncement', 'title', 'required')
                                        || this.hasError('formEditAnnouncement', 'title', 'len')
                                        || this.hasError('formEditAnnouncement', 'title', 'contains-alpha')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["required", "len", "contains-alpha"]'
                                    data-param='[3, 50]'
                                    value={this.state.formEditAnnouncement.title || ''} />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formEditAnnouncement', 'title', 'required') && <span className="invalid-feedback">Title is required</span>}
                                {this.hasError('formEditAnnouncement', 'title', 'len') && <span className="invalid-feedback">Title must be between 3 and 50 characters in length</span>}
                                {this.hasError('formEditAnnouncement', 'title', 'contains-alpha') && <span className="invalid-feedback">Title must contain at least one alpha character</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-announcementMessage">Message</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="textarea"
                                    id="id-announcementMessage"
                                    name="message"
                                    className="border-right-0 no-resize"
                                    invalid={
                                        this.hasError('formEditAnnouncement', 'message', 'maxlen')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["maxlen"]'
                                    data-param='4500'
                                    value={this.state.formEditAnnouncement.message || ''}
                                    rows={10}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formEditAnnouncement', 'message', 'maxlen') && <span className="invalid-feedback">Message must not have more than 4500 characters</span>}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        <Button
                            color="primary"
                            type="submit"
                            onMouseDown={e => e.preventDefault()}>
                            Save
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}

export default EditAnnouncementForm;