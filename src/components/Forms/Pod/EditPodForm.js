import React, { Component } from 'react';
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
import { getPod, editPod } from '../../../connectors/Pod';
import FormValidator from '../../Forms/FormValidator';

class EditPodForm extends Component {

    state = {
        formEditPod: {
            podName: '',
            description: '',
            phone: '',
            address: ''
        },
        pod: this.props.pod,
        modal: this.props.modal,
    }

    toggleModal = () => {
        this.populateForm()
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

     /* Clean phone input */
     cleanPhoneNumber = (phoneNumber) => {
        return "+" + phoneNumber.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "");
    }

    constructRequestPayload = () => {
        var payload = {
            "podName": this.state.formEditPod.podName,
            "phone": this.cleanPhoneNumber(this.state.formEditPod.phone),
            "address": this.state.formEditPod.address
        };

        if (this.state.formEditPod.description) {
            payload.podDescription = this.state.formEditPod.description
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
            var res = editPod(this.state.pod.id, this.constructRequestPayload());
            if (res.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully edited pod",
                    confirmButtonColor: "#5d9cec",
                    icon: "success",
                })
                var res = getPod(this.state.pod.id)
                this.props.updateOnEdit(res)
            }
            else {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    confirmButtonColor: "#5d9cec",
                    text: res.message
                })
            }
        }
    }

    populateForm() {
        var stateCopy = this.state.formEditPod;
        var res = getPod(this.props.pod.id)
        if (res.isSuccess) {
            this.setState({
                pod: res.data
            })
            stateCopy.podName = res.data.podName
            stateCopy.description = res.data.podDescription
            stateCopy.phone = res.data.phone.replace("+", "")
            stateCopy.address = res.data.address
            this.setState(stateCopy)
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.modal !== prevProps.modal) {
            if (this.props.modal) this.populateForm();
            this.setState({ modal: this.props.modal })
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal}>
                <form className="mb-3" name="formEditPod" onSubmit={this.onSubmit}>
                    <ModalHeader toggle={this.toggleModal}>Edit Pod</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-podName">Name</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-podName"
                                    name="podName"
                                    className="border-right-0"
                                    placeholder="Name"
                                    invalid={
                                        this.hasError('formEditPod', 'podName', 'required')
                                        || this.hasError('formEditPod', 'podName', 'maxlen')
                                        || this.hasError('formEditPod', 'podName', 'podname')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["required", "maxlen", "podname"]'
                                    data-param='50'
                                    value={this.state.formEditPod.podName || ''}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formEditPod', 'podName', 'required') && <span className="invalid-feedback">Name is required</span>}
                                {this.hasError('formEditPod', 'podName', 'maxlen') && <span className="invalid-feedback">Name must not have more than 50 characters</span>}
                                {this.hasError('formEditPod', 'podName', 'podname') && <span className="invalid-feedback">Name must contain alpha, numeric, or hyphen characters only</span>}
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
                                        this.hasError('formEditPod', 'description', 'maxlen')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["maxlen"]'
                                    data-param='100'
                                    value={this.state.formEditPod.description || ''}
                                    rows={5}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formEditPod', 'description', 'maxlen') && <span className="invalid-feedback">Description must have not have more than 100 characters</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-phone">Phone Number</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-phone"
                                    name="phone"
                                    className="border-right-0"
                                    placeholder="(XXX) XXX-XXXX"
                                    invalid={
                                        this.hasError('formEditPod', 'phone', 'required')
                                        || this.hasError('formEditPod', 'phone', 'phone-digits')
                                        || this.hasError('formEditPod', 'phone', 'phone-chars')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["required", "phone-digits", "phone-chars"]'
                                    data-param='10'
                                    value={this.state.formEditPod.phone || ''}
                                />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-phone"></em>
                                    </span>
                                </div>
                                {this.hasError('formEditPod', 'phone', 'required') && <span className="invalid-feedback">Phone number is required</span>}
                                {this.hasError('formEditPod', 'phone', 'phone-digits') && <span className="invalid-feedback">Phone number must contain exactly 10 digits</span>}
                                {this.hasError('formEditPod', 'phone', 'phone-chars') && <span className="invalid-feedback">Phone number must only contain digits 0-9, () or -</span>}
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
                                    value={this.state.formEditPod.address || ''}
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
                        <Button color="primary" type="submit">Save</Button>
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}

export default EditPodForm;