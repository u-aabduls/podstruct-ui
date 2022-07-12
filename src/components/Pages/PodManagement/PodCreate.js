import React, { Component } from 'react';
import { Input } from 'reactstrap';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Row, Col, TabContent, TabPane } from 'reactstrap';
import send from "../../../connectors/PodCreation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormValidator from '../../Forms/FormValidator.js';

class PodCreate extends Component {

    state = {
        activeTab: 'Pod Creation',
        podCreate: {
            podName: '',
            description: '',
            phone: '',
            address: ''
        }
    }

    /**
     * Validate input using onChange event
     * @param  {String} formName The name of the form in the state object
     * @return {Function} a function used for the event
     */
    validateOnChange = event => {
        const input = event.target;
        const form = input.form;
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

    displayToast = (toastMessage, toastType, toastPosition) => toast(toastMessage, {
        type: toastType,
        position: toastPosition
    })

    onSubmit = e => {

        const form = e.target;

        const inputsToValidate = [
            'podName',
            'description',
            'phone',
            'address'
        ];

        const inputs = [...form.elements].filter(i => inputsToValidate.includes(i.name))

        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                errors
            }
        });

        console.log(hasError ? 'Form has errors. Check!' : 'Form Submitted!')

        if (!hasError) {
            var result = send(this.constructRequestPayload());
            this.displayToast(
                result.message,
                result.isSuccess ? "success" : "error",
                "bottom-center"
            );
            if (result.isSuccess) {
                setTimeout(() => this.props.history.push('/pods/view'), 5000);
            }
        }

        e.preventDefault();
    }

    render() {
        return (
            <ContentWrapper>
                <div className="container-md mx-0">
                    <Row>                            
                        <Col lg="9">
                            <TabContent activeTab={this.state.activeTab} className="p-0 b0">
                                <TabPane tabId="Pod Creation">
                                    <div className="card b">
                                        <div className="card-header bg-gray-lighter text-bold">Create a Pod</div>
                                        <div className="card-body">
                                            <form className="mb-3" name="podCreate" onSubmit={this.onSubmit}>
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
                                                            value={this.state.podCreate.podName}
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
                                                            value={this.state.podCreate.description}
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
                                                            value={this.state.podCreate.phone}
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
                                                            value={this.state.podCreate.address}
                                                        />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text text-muted bg-transparent border-left-0">
                                                                <em className="fa fa-book"></em>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="btn btn-primary" type="submit">Create pod</button>
                                            </form>
                                        </div>
                                    </div>
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                    <ToastContainer />
                </div>
            </ContentWrapper>
        );
    }
}

export default PodCreate;


