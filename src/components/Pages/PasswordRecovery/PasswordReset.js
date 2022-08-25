import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { resetPassword } from "../../../connectors/Password";
import FormValidator from '../../Forms/FormValidator.js';
import { ToastContainer, toast } from 'react-toastify';

class PasswordReset extends Component {

    state = {
        formPasswordReset: {
            verificationCode: '',
            password: '',
            confirmedPassword: ''
        },
        errorMessage: null
    }

    errorMessageStyling = {
        color: '#f05050', 
        width: '100%', 
        marginTop: '1.5rem', 
        fontSize: '80%'
    }

    validateOnChange = event => {
        const input = event.target;
        const form = input.form;
        const result = FormValidator.validate(input);

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                [input.name]: input.value,
                errors: {
                    ...this.state[form.name].errors,
                    [input.name]: result
                }
            }
        });
    }

    /* Build payload */
    constructRequestPayload = () => {
        return JSON.stringify({
            "password": this.state.formPasswordReset.password,
            "confirmationCode": this.state.formPasswordReset.verificationCode
        })
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return this.state[formName] &&
            this.state[formName].errors &&
            this.state[formName].errors[inputName] &&
            this.state[formName].errors[inputName][method]
    }

    displayToast = (toastMessage, toastType, toastPosition) => toast(toastMessage, {
        type: toastType,
        position: toastPosition
    })

    onSubmit = e => {

        const form = e.target;
        const inputsToValidate = [
            'verificationCode',
            'password',
            'confirmedPassword'
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
            var result = resetPassword(this.constructRequestPayload());
            if (result.isSuccess) {
                this.setState({errorMessage: null});
                this.displayToast(result.message, "success", "bottom-center");
                    // redirect to login page
                setTimeout(() => this.props.history.push('/login'), 5000);
                } else {
                this.setState({errorMessage: result.message});
            }
        }

        e.preventDefault();
    }

    render() {
        return (
            <div className="block-center mt-4 wd-xl">
                {/* START card */}
                <div className="card card-flat">
                    <div className="card-header text-center bg-primary">
                        <a href="">
                            <img className="block-center" src="img/logos/favicon.png" alt="Logo" />
                            <img className="block-center" style={{ marginLeft: 4 + 'px' }} src="img/logos/podstruct_text.svg" alt="Logo" />
                        </a>
                    </div>
                    <div className="card-body">
                        <p className="text-center py-2">PASSWORD RESET</p>
                        <form name="formPasswordReset" onSubmit={this.onSubmit}>
                            <p className="text-left">Enter the verification code and your new password. If the verification code matches, your password will be reset.</p>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="resetInputEmail1">Verification code</label>
                                <div className="input-group with-focus">
                                    <Input
                                        name="verificationCode"
                                        className="form-control border-right-0" 
                                        type="text" 
                                        placeholder="Verification code" 
                                        autoComplete="off"
                                        invalid={
                                            this.hasError('formPasswordReset', 'verificationCode', 'required')
                                            || this.hasError('formPasswordReset', 'verificationCode', 'number')
                                        }
                                        data-validate='["required", "number"]'
                                        onChange={this.validateOnChange}
                                        value={this.state.formPasswordReset.verificationCode}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-key"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formPasswordReset', 'verificationCode', 'required') && <span className="invalid-feedback">Verification code is required</span>}
                                    {this.hasError('formPasswordReset', 'verificationCode', 'number') &&
                                        <span className="invalid-feedback">
                                            Verification code must only contain numeric values
                                        </span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="resetInputEmail1">New password</label>
                                <div className="input-group with-focus">
                                    <Input 
                                        type="password"
                                        id="id-password"
                                        name="password"
                                        className="border-right-0"
                                        placeholder="Password"
                                        invalid={
                                            this.hasError('formPasswordReset', 'password', 'required')
                                            || this.hasError('formPasswordReset', 'password', 'password')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "password"]'
                                        value={this.state.formPasswordReset.password}
                                        autoComplete='off'
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-lock"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formPasswordReset', 'password', 'required') && <span className="invalid-feedback">Password is required</span>}
                                    {this.hasError('formPasswordReset', 'password', 'password') &&
                                        <span className="invalid-feedback">
                                            Password must have at least 8 characters including each of one of the following:
                                            upper case, lower case, numeric and special character
                                        </span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="resetInputEmail1">Confirm password</label>
                                <div className="input-group with-focus">
                                    <Input 
                                        type="password"
                                        name="confirmedPassword"
                                        className="border-right-0"
                                        placeholder="Retype password"
                                        invalid={this.hasError('formPasswordReset', 'confirmedPassword', 'equalto')}
                                        onChange={this.validateOnChange}
                                        data-validate='["equalto"]'
                                        value={this.state.formPasswordReset.confirmedPassword}
                                        data-param="id-password"
                                        autoComplete='off'
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-lock"></em>
                                        </span>
                                    </div>
                                    <span className="invalid-feedback">Password confirmation doesn't match password</span>
                                    {this.state.errorMessage && <p style={this.errorMessageStyling}>{this.state.errorMessage}</p>}
                                </div>
                            </div>                         
                            <button className="btn btn-success btn-block" type="submit">Update password</button>
                            <Link to="/password/recover" className="btn btn-block btn-secondary">Resend verification code</Link>
                            <ToastContainer />
                        </form>
                    </div>
                </div>
                {/* END card */}
                <div className="p-3 text-center">
                    <span className="mr-2">&copy;</span>
                    <span>{new Date().getFullYear()}</span>
                    <span className="mx-2">-</span>
                    <span>Podstruct</span>
                </div>
            </div>
        );
    }
}

export default PasswordReset;