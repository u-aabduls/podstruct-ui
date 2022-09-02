import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Row, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import getPods from "../../../connectors/PodsRetrieval";
import PodCard from './PodCard';
import FormValidator from '../../Forms/FormValidator';
import Swal from 'sweetalert2';
import send from "../../../connectors/PodCreation";

class PodManagement extends Component {

    state = {
        pods: [],
        podCreate: {
            name: '',
            description: '',
            phone: '',
            address: ''
        },
        modal: false
    }

    buttonLabelStyle = {
        marginRight: `0.3rem`
    }

    contentHeadingStyle = {
        marginBottom: `1rem`,
        justifyContent: `space-between`
    }

    toggleModal = () => {
        this.setState({
            podCreate: {
                name: '',
                description: '',
                phone: '',
                address: ''
            },
            modal: !this.state.modal
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

    /* Build payload */
    constructRequestPayload = () => {
        var payload = {
            "podName": this.state.podCreate.podName,
            "phone": this.cleanPhoneNumber(this.state.podCreate.phone),
            "address": this.state.podCreate.address
        };

        if (this.state.podCreate.description) {
            payload.podDescription = this.state.podCreate.description
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
            var result = send(this.constructRequestPayload());
            if (result.isSuccess) {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully created pod",
                    confirmButtonColor: "#5d9cec",
                    icon: "success",
                }).then(
                    (acknowledged) => {
                        window.location.href = window.location.href;
                    }
                )
            } else {
                this.toggleModal();
                Swal.fire({
                    title: "Error creating pod",
                    icon: "error",
                    confirmButtonColor: "#5d9cec",
                    text: result.message
                })
            }
        }
    }

    componentDidMount() {
        var result = getPods().payload;
        result.sort(function (a, b) {
            return (a.podName).localeCompare(b.podName);
        })
        this.setState({ pods: result });
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading" style={this.contentHeadingStyle}>
                    <div>
                        Pods
                        <small>View and create pods</small>
                    </div>
                    <div>
                        <button className="btn btn-success"
                            onClick={this.toggleModal}>
                            <em className="fa fa-plus-circle fa-sm" style={this.buttonLabelStyle}></em> Create Pod
                        </button>
                        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                            <form className="mb-3" name="podCreate" onSubmit={this.onSubmit}>
                                <ModalHeader>Create Pod</ModalHeader>
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
                                                    this.hasError('podCreate', 'podName', 'required')
                                                    || this.hasError('podCreate', 'podName', 'maxlen')
                                                    || this.hasError('podCreate', 'podName', 'podname')
                                                    || this.hasError('podCreate', 'podName', 'begin-end-spacing')
                                                    || this.hasError('podCreate', 'podName', 'consecutive-spacing')
                                                }
                                                onChange={this.validateOnChange}
                                                data-validate='["required", "maxlen", "podname", "begin-end-spacing", "consecutive-spacing"]'
                                                data-param='50'
                                                value={this.state.podCreate.podName || ''}
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                                    <em className="fa fa-book"></em>
                                                </span>
                                            </div>
                                            {this.hasError('podCreate', 'podName', 'required') && <span className="invalid-feedback">Name is required</span>}
                                            {this.hasError('podCreate', 'podName', 'maxlen') && <span className="invalid-feedback">Name must not have more than 50 characters</span>}
                                            {this.hasError('podCreate', 'podName', 'podname') && <span className="invalid-feedback">Name must contain alpha, numeric, or hyphen characters only</span>}
                                            {this.hasError('podCreate', 'podName', 'begin-end-spacing') && <span className="invalid-feedback">Name must not begin or end with a space character</span>}
                                            {this.hasError('podCreate', 'podName', 'consecutive-spacing') && <span className="invalid-feedback">Name must not contain consecutive space characters</span>}
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
                                                placeholder="Description"
                                                invalid={
                                                    this.hasError('podCreate', 'description', 'maxlen')
                                                    || this.hasError('podCreate', 'description', 'begin-end-spacing')
                                                    || this.hasError('podCreate', 'description', 'consecutive-spacing')
                                                }
                                                onChange={this.validateOnChange}
                                                data-validate='["maxlen", "begin-end-spacing", "consecutive-spacing"]'
                                                data-param='100'
                                                value={this.state.podCreate.description || ''}
                                                rows={5}
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                                    <em className="fa fa-book"></em>
                                                </span>
                                            </div>
                                            {this.hasError('podCreate', 'description', 'maxlen') && <span className="invalid-feedback">Description must have not have more than 100 characters</span>}
                                            {this.hasError('podCreate', 'description', 'begin-end-spacing') && <span className="invalid-feedback">Description must not begin or end with a space character</span>}
                                            {this.hasError('podCreate', 'description', 'consecutive-spacing') && <span className="invalid-feedback">Description must not contain consecutive space characters</span>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-muted" htmlFor="signupInputPhone">Phone Number</label>
                                        <div className="input-group with-focus">
                                            <Input
                                                type="text"
                                                id="id-phone"
                                                name="phone"
                                                className="border-right-0"
                                                placeholder="(XXX) XXX-XXXX"
                                                invalid={
                                                    this.hasError('podCreate', 'phone', 'required')
                                                    || this.hasError('podCreate', 'phone', 'phone')
                                                }
                                                onChange={this.validateOnChange}
                                                data-validate='["required", "phone"]'
                                                data-param='10'
                                                value={this.state.podCreate.phone || ''}
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                                    <em className="fa fa-phone"></em>
                                                </span>
                                            </div>
                                            {this.hasError('podCreate', 'phone', 'required') && <span className="invalid-feedback">Phone number is required</span>}
                                            {this.hasError('podCreate', 'phone', 'phone') && <span className="invalid-feedback">Phone number must contain exactly 10 digits</span>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-muted">Address</label>
                                        <div className="input-group with-focus">
                                            <Input
                                                type="text"
                                                id="address"
                                                name="address"
                                                className="border-right-0"
                                                placeholder="Address"
                                                onChange={this.validateOnChange}
                                                value={this.state.podCreate.address || ''}
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
                                    <Button color="primary" type="submit">Create</Button>
                                </ModalFooter>
                            </form>
                        </Modal>
                    </div>
                </div>
                <Row>
                    {this.state.pods.map(function (object, i) {
                        return (
                            object.active ?
                                <Col key={i} xl="4" lg="6">
                                    <PodCard
                                        name={object.podName}
                                        description={object.podDescription}
                                        role={object.roleInPod}
                                        courseCount={0}
                                        studentCount={0}
                                        action={object.roleInPod === "ROLE_ADMIN" ? ["Manage", "Deactivate"] :
                                            object.roleInPod === "ROLE_TEACHER" ? ["Manage"] : ["View"]}
                                        id={object.id}
                                        key={i}
                                    />
                                </Col> : null
                        );
                    })}
                </Row>
            </ContentWrapper>
        );
    }
}

export default PodManagement;
