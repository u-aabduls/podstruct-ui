import React, { Component } from 'react';
import {
    Button,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import Swal from 'sweetalert2';
import { createPod } from "../../../connectors/Pod";
import FormValidator from '../FormValidator';
import { swalConfirm, dangerText } from '../../../utils/Styles';

class AddPodForm extends Component {

    state = {
        formAddPod: {
            podName: '',
            description: '',
            phone: '',
            address: ''
        },
        pod: this.props.pod,
        modal: false,
    }

    toggleModal = () => {
        this.props.toggle();
        this.setState({
            formAddPod: {
                name: '',
                description: '',
                phone: '',
                address: ''
            },
        });
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
            },
            modal: this.state.modal
        });
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return this.state[formName] &&
            this.state[formName].errors &&
            this.state[formName].errors[inputName] &&
            this.state[formName].errors[inputName][method]
    }

    /* Clean phone input */
    cleanPhoneNumber = (phoneNumber) => {
        return "+" + phoneNumber.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "");
    }

    constructRequestPayload = () => {
        var payload = {
            "podName": this.state.formAddPod.podName,
            "phone": this.cleanPhoneNumber(this.state.formAddPod.phone),
            "address": this.state.formAddPod.address
        };

        if (this.state.formAddPod.description) {
            payload.podDescription = this.state.formAddPod.description
        }

        return JSON.stringify(payload);
    }

    onSubmit = e => {
        e.preventDefault();

        const form = e.target;

        const inputsToValidate = [
            'podName',
            'description',
            'phone',
            'address',
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
            var result = createPod(this.constructRequestPayload());
            if (result.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully created pod",
                    confirmButtonColor: swalConfirm(),
                    icon: "success",
                })
                this.props.updateOnAdd();
            } else {
                this.toggleModal();
                Swal.fire({
                    title: "Error creating pod",
                    icon: "error",
                    confirmButtonColor: swalConfirm(),
                    text: result.message
                })
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.modal !== prevProps.modal) {
            this.setState({ modal: this.props.modal });
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal}>
                <form className="mb-3" name="formAddPod" onSubmit={this.onSubmit}>
                    <ModalHeader toggle={this.toggleModal}>Create Pod</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-podName">Name <span style={dangerText()}>*</span></label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-podName"
                                    name="podName"
                                    className="border-right-0"
                                    placeholder="Name"
                                    invalid={
                                        this.hasError('formAddPod', 'podName', 'required')
                                        || this.hasError('formAddPod', 'podName', 'maxlen')
                                        || this.hasError('formAddPod', 'podName', 'podname')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["required", "maxlen", "podname"]'
                                    data-param='50'
                                    value={this.state.formAddPod.podName || ''}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formAddPod', 'podName', 'required') && <span className="invalid-feedback">Name is required</span>}
                                {this.hasError('formAddPod', 'podName', 'maxlen') && <span className="invalid-feedback">Name must not have more than 50 characters</span>}
                                {this.hasError('formAddPod', 'podName', 'podname') && <span className="invalid-feedback">Name must contain alpha, numeric, or hyphen characters only</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-description">Description</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="textarea"
                                    id="id-description"
                                    name="description"
                                    className="border-right-0 no-resize"
                                    invalid={
                                        this.hasError('formAddPod', 'description', 'maxlen')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["maxlen"]'
                                    data-param='100'
                                    value={this.state.formAddPod.description || ''}
                                    rows={5}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formAddPod', 'description', 'maxlen') && <span className="invalid-feedback">Description must have not have more than 100 characters</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-phone">Phone Number <span style={dangerText()}>*</span></label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-phone"
                                    name="phone"
                                    className="border-right-0"
                                    placeholder="(XXX) XXX-XXXX"
                                    invalid={
                                        this.hasError('formAddPod', 'phone', 'required')
                                        || this.hasError('formAddPod', 'phone', 'phone-digits')
                                        || this.hasError('formAddPod', 'phone', 'phone-chars')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["required", "phone-digits", "phone-chars"]'
                                    data-param='10'
                                    value={this.state.formAddPod.phone || ''}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-phone"></em>
                                    </span>
                                </div>
                                {this.hasError('formAddPod', 'phone', 'required') && <span className="invalid-feedback">Phone number is required</span>}
                                {this.hasError('formAddPod', 'phone', 'phone-digits') && <span className="invalid-feedback">Phone number must contain exactly 10 digits</span>}
                                {this.hasError('formAddPod', 'phone', 'phone-chars') && <span className="invalid-feedback">Phone number must only contain digits 0-9, () or -</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-address">Address</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-address"
                                    name="address"
                                    className="border-right-0"
                                    placeholder="Address"
                                    onChange={this.validateOnChange}
                                    value={this.state.formAddPod.address || ''}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
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
        )
    }
}

export default AddPodForm;