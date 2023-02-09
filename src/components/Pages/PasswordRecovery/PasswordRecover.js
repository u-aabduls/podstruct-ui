import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { recoverPassword } from "../../../connectors/Password";
import FormValidator from '../../Forms/FormValidator.js';
import { Link } from 'react-router-dom';
import { dangerText, errorMessageStyling } from '../../../utils/Styles';

class Recover extends Component {

    state = {
        formPasswordRecover: {
            email: '',
        },
        errorMessage: null
    }

    validateOnChange = event => {
        const input = event.target;
        const form = input.form;
        const result = FormValidator.validate(input);

        this.setState({
            [form.name]: {
                [input.name]: input.value,
                errors: {
                    [input.name]: result
                }
            }
        });
    }

    /* Build payload */
    constructRequestHeader = () => {
        return this.state.formPasswordRecover.email;
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return this.state[formName] &&
            this.state[formName].errors &&
            this.state[formName].errors[inputName] &&
            this.state[formName].errors[inputName][method]
    }

    onSubmit = e => {

        const form = e.target;
        const inputsToValidate = [
            'email'
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
            var result = recoverPassword(this.constructRequestHeader());
            if (result.isSuccess) {
                this.setState({errorMessage: null});
                    // redirect to password/reset page
                this.props.history.push('/password/reset');
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
                        <a href="/#">
                            <img className="block-center" src="img/logos/favicon.png" alt="Logo" />
                            <img className="block-center" style={{ marginLeft: '0.25rem' }} src="img/logos/podstruct_text.svg" alt="Logo" />
                        </a>
                    </div>
                    <div className="card-body">
                        <p className="text-center py-2">PASSWORD RESET</p>
                        <form name="formPasswordRecover" onSubmit={this.onSubmit}>
                            <p className="text-left">Enter your email registered with Podstruct and request a verification code. The verification code will be sent momentarily.</p>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="id-email">Email address <span style={dangerText()}>*</span></label>
                                <div className="input-group with-focus">
                                    <Input
                                        type="email"
                                        id="id-email"
                                        className="form-control border-right-0"
                                        name="email"
                                        placeholder="Enter email"
                                        invalid={
                                            this.hasError('formPasswordRecover', 'email', 'required') 
                                            || this.hasError('formPasswordRecover', 'email', 'email')
                                        }
                                        autoComplete="off"
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "email"]'
                                        value={this.state.formPasswordRecover.email}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-envelope"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formPasswordRecover', 'email', 'required') && <span className="invalid-feedback">Email is required</span>}
                                    {this.hasError('formPasswordRecover', 'email', 'email') && <span className="invalid-feedback">Email must be a valid email</span>}
                                    {this.state.errorMessage && <p style={errorMessageStyling()}>{this.state.errorMessage}</p>}
                                </div>
                            </div>                          
                            <button className="btn btn-primary btn-block" type="submit">Request verification code</button>
                            <Link to="/login" className="btn btn-block btn-secondary">Return to login</Link>
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

export default Recover;
