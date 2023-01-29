import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Row, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { getPods, createPod } from "../../../connectors/Pod";
import PodCard from './PodCard';
import FormValidator from '../../Forms/FormValidator';
import Swal from 'sweetalert2';
import { Divider } from '@material-ui/core';

class PodManagement extends Component {

    state = {
        pods: [],
        pendingPods: [],
        getPodParams: {
            accepted: {
                inviteStatus: 'ACCEPTED'
            },
            pending: {
                inviteStatus: 'INVITED'
            }
        },
        podCreate: {
            name: '',
            description: '',
            phone: '',
            address: ''
        },
        modal: false
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

    getLatestPods = () => {
        var params = this.state.getPodParams.accepted;
        var result = getPods(params.inviteStatus).data;
        if (result) {
            result.sort(function (a, b) {
                return (a.podName).localeCompare(b.podName);
            })
            this.setState({ pods: result });
        }
        params = this.state.getPodParams.pending;
        result = getPods(params.inviteStatus).data;
        if (result) {
            result.sort(function (a, b) {
                return (a.podName).localeCompare(b.podName);
            })
            this.setState({ pendingPods: result });
        }
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
                    confirmButtonColor: "#5d9cec",
                    icon: "success",
                })
                this.getLatestPods();
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

    componentWillMount() {
       this.getLatestPods();
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
                            onClick={this.toggleModal}
                            onMouseDown={e => e.preventDefault()}
                        >
                            <em className="fa fa-plus-circle fa-sm button-create-icon"></em> Create Pod
                        </button>
                        <Modal isOpen={this.state.modal}>
                            <form className="mb-3" name="podCreate" onSubmit={this.onSubmit}>
                                <ModalHeader toggle={this.toggleModal}>Create Pod</ModalHeader>
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
                                                }
                                                onChange={this.validateOnChange}
                                                data-validate='["required", "maxlen", "podname"]'
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
                                                }
                                                onChange={this.validateOnChange}
                                                data-validate='["maxlen"]'
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
                                                    this.hasError('podCreate', 'phone', 'required')
                                                    || this.hasError('podCreate', 'phone', 'phone-digits')
                                                    || this.hasError('podCreate', 'phone', 'phone-chars')
                                                }
                                                onChange={this.validateOnChange}
                                                data-validate='["required", "phone-digits", "phone-chars"]'
                                                data-param='10'
                                                value={this.state.podCreate.phone || ''}
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                                    <em className="fa fa-phone"></em>
                                                </span>
                                            </div>
                                            {this.hasError('podCreate', 'phone', 'required') && <span className="invalid-feedback">Phone number is required</span>}
                                            {this.hasError('podCreate', 'phone', 'phone-digits') && <span className="invalid-feedback">Phone number must contain exactly 10 digits</span>}
                                            {this.hasError('podCreate', 'phone', 'phone-chars') && <span className="invalid-feedback">Phone number must only contain digits 0-9, () or -</span>}
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
                {this.state.pendingPods.length > 0 ? <h3>Invitations</h3> : null}
                <Row className={`${this.state.pendingPods.length > 0 && "mb-5"}`}>
                    {this.state.pendingPods.map(function (object, i) {
                        return (
                            object.active ?
                                <Col key={i} xl="4" lg="6">
                                    {/* <PodCard
                                    name={object.podName}
                                    description={object.podDescription}
                                    role={object.roleInPod}
                                    courseCount={0}
                                    studentCount={0}
                                    action={object.roleInPod === "ROLE_ADMIN" ? ["Manage", "Deactivate"] :
                                        object.roleInPod === "ROLE_TEACHER" ? ["Manage"] : ["View"]}
                                    id={object.id}
                                    key={i}
                                /> */}
                                    <PodCard
                                        pod={object}
                                    />
                                </Col>
                                : null
                        );
                    })}
                </Row>
                {this.state.pendingPods.length > 0 ? <Divider className="mb-5" /> : null}
                {this.state.pods.length > 0 ? <h3>Pods</h3> : null}
                <Row>
                    {this.state.pods.map(function (object, i) {
                        return (
                            object.active ?
                                <Col key={i} xl="4" lg="6">
                                    {/* <PodCard
                                    name={object.podName}
                                    description={object.podDescription}
                                    role={object.roleInPod}
                                    courseCount={0}
                                    studentCount={0}
                                    action={object.roleInPod === "ROLE_ADMIN" ? ["Manage", "Deactivate"] :
                                        object.roleInPod === "ROLE_TEACHER" ? ["Manage"] : ["View"]}
                                    id={object.id}
                                    key={i}
                                /> */}
                                    <PodCard
                                        pod={object}
                                    />
                                </Col>
                                : null
                        );
                    })}
                </Row>
            </ContentWrapper>
        );
    }
}

export default PodManagement;
