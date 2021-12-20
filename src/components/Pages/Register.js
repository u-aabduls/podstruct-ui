import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, CustomInput } from 'reactstrap';

import FormValidator from '../Forms/FormValidator.js';

class Register extends Component {

    state = {
        formRegister: {
            email: '',
            firstName: '',
            lastName: '',
            podName: '',
            password: '',
            confirmedPassword: '',
            terms: false
        }
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

    onSubmit = e => {
        const form = e.target;
        const inputs = [...form.elements].filter(i => ['INPUT', 'SELECT'].includes(i.nodeName))

        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                errors
            }
        });

        console.log(hasError ? 'Form has errors. Check!' : 'Form Submitted!')

        e.preventDefault()
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return  this.state[formName] &&
                this.state[formName].errors &&
                this.state[formName].errors[inputName] &&
                this.state[formName].errors[inputName][method]
    }

    render() {
        return (
            <div className="block-center mt-4 wd-xl">
                {/* START card */}
                <div className="card card-flat">
                    <div className="card-header text-center bg-dark">
                        <a href="">
                            <img className="block-center" src="img/logo.png" alt="Logo"/>
                        </a>
                    </div>
                    <div className="card-body">
                        <p className="text-center py-2">CREATE YOUR PODSTRUCT ACCOUNT</p>
                        <form className="mb-3" name="formRegister" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputEmail1">Email address</label>
                                <div className="input-group with-focus">
                                    <Input type="email"
                                        name="email"
                                        className="border-right-0"
                                        placeholder="Enter email"
                                        invalid={this.hasError('formRegister','email','required') || this.hasError('formRegister','email','email')}
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "email"]'
                                        value={this.state.formRegister.email}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-envelope"></em>
                                        </span>
                                    </div>
                                    { this.hasError('formRegister','email','required') && <span className="invalid-feedback">Email is required</span> }
                                    { this.hasError('formRegister','email','email') && <span className="invalid-feedback">Email must be a valid email</span> }
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputPassword1">First name</label>
                                <div className="input-group with-focus">
                                    <Input type="text"
                                        id="id-firstName"
                                        name="firstName"
                                        className="border-right-0"
                                        placeholder="First name"
                                        invalid={
                                                this.hasError('formRegister','firstName','required') 
                                            ||  this.hasError('formRegister','firstName','minlen')
                                            ||  this.hasError('formRegister','firstName','name')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "minlen", "name"]'
                                        data-param='2'
                                        value={this.state.formRegister.firstName}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    { this.hasError('formRegister','firstName','required') && <span className="invalid-feedback">First name is required</span> }
                                    { this.hasError('formRegister','firstName','minlen') && <span className="invalid-feedback">First name must have at least 2 characters</span> }
                                    { this.hasError('formRegister','firstName','name') && <span className="invalid-feedback">First name must contain alpha characters only</span> }
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputPassword1">Last name</label>
                                <div className="input-group with-focus">
                                    <Input type="text"
                                        id="id-lastName"
                                        name="lastName"
                                        className="border-right-0"
                                        placeholder="Last name"
                                        invalid={
                                                this.hasError('formRegister','lastName','required') 
                                            ||  this.hasError('formRegister','lastName','minlen')
                                            ||  this.hasError('formRegister','lastName','name')
                                        }                                        
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "minlen", "name"]'
                                        data-param='2'
                                        value={this.state.formRegister.lastName}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    { this.hasError('formRegister','lastName','required') && <span className="invalid-feedback">Last name is required</span> }
                                    { this.hasError('formRegister','lastName','minlen') && <span className="invalid-feedback">Last name must have at least 2 characters</span> }
                                    { this.hasError('formRegister','lastName','name') && <span className="invalid-feedback">Last name must contain alpha characters only</span> }
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputPassword1">POD name</label>
                                <div className="input-group with-focus">
                                    <Input type="text"
                                        id="id-podName"
                                        name="podName"
                                        className="border-right-0"
                                        placeholder="POD name"
                                        invalid={
                                                this.hasError('formRegister','podName','required') 
                                            ||  this.hasError('formRegister','podName','minlen')
                                            ||  this.hasError('formRegister','podName','podname')
                                        } 
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "minlen", "podname"]'
                                        data-param='2'
                                        value={this.state.formRegister.podName}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-users"></em>
                                        </span>
                                    </div>
                                    { this.hasError('formRegister','podName','required') && <span className="invalid-feedback">POD name is required</span> }
                                    { this.hasError('formRegister','podName','minlen') && <span className="invalid-feedback">POD name must have at least 2 characters</span> }
                                    { this.hasError('formRegister','podName','podname') && <span className="invalid-feedback">POD name must be alphanumeric</span> }
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputPassword1">Password</label>
                                <div className="input-group with-focus">
                                    <Input type="text"
                                        id="id-password"
                                        name="password"
                                        className="border-right-0"
                                        placeholder="Password"
                                        invalid={
                                                this.hasError('formRegister','password','required') 
                                            ||  this.hasError('formRegister','password','password')
                                        } 
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "password"]'
                                        value={this.state.formRegister.password}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-lock"></em>
                                        </span>
                                    </div>
                                    { this.hasError('formRegister','password','required') && <span className="invalid-feedback">Password is required</span> }
                                    { this.hasError('formRegister','password','password') && 
                                        <span className="invalid-feedback">
                                            Password must have at least 8 characters including each of one of the following:
                                            upper case, lower case, numeric and special character.
                                        </span> }
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputRePassword1">Confirm Password</label>
                                <div className="input-group with-focus">
                                    <Input type="text" 
                                        name="confirmedPassword"
                                        className="border-right-0"
                                        placeholder="Retype assword"
                                        invalid={this.hasError('formRegister','confirmedPassword','equalto')}
                                        onChange={this.validateOnChange}
                                        data-validate='["equalto"]'
                                        value={this.state.formRegister.confirmedPassword}
                                        data-param="id-password"
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-lock"></em>
                                        </span>
                                    </div>
                                    <span className="invalid-feedback">Password confirmation doesn't match password</span>
                                </div>
                            </div>
                            {/* <CustomInput type="checkbox" id="terms"
                                name="terms"
                                label="I agree with the terms"
                                invalid={this.hasError('formRegister','terms','required')}
                                onChange={this.validateOnChange}
                                data-validate='["required"]'
                                checked={this.state.formRegister.terms}>
                                    <span className="invalid-feedback">Field is required</span>
                            </CustomInput> */}
                            <button className="btn btn-block btn-primary mt-3" type="submit">Create account</button>
                        </form>
                        <p className="pt-3 text-center">Have an account?</p>
                        <Link to="login" className="btn btn-block btn-secondary">Log in</Link>
                    </div>
                </div>
                {/* END card */}
                <div className="p-3 text-center">
                    <span className="mr-2">&copy;</span>
                    <span>2021</span>
                    <span className="mx-2">-</span>
                    <span>Podstruct</span>
                </div>
            </div>
        );
    }
}

export default Register;