import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input } from 'reactstrap';
import MonthSelector from "../Common/MonthSelector";
import DaySelector from "../Common/DaySelector";
import YearSelector from "../Common/YearSelector";
import send from "../../connectors/AccountCreation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { CustomInput } from 'reactstrap';

import FormValidator from '../Forms/FormValidator.js';

class Register extends Component {

    state = {
        formRegister: {
            email: '',
            firstName: '',
            lastName: '',
            dob: {
                month: '',
                day: '',
                year: '',
                error: {
                    isNull: false,
                    isInFuture: false
                }
            },
            phone: '',
            password: '',
            confirmedPassword: '',
            terms: false
        }
    }

    errorMessageStyling = {
        color: '#f05050', 
        width: '100%', 
        marginTop: '0.25rem', 
        fontSize: '80%'
    }

        setMonth = (month) => {
            var stateCopy = this.state.formRegister;
            stateCopy.dob.month = month;
            this.setState(stateCopy);
        };

        setDay = (day) => {
            var stateCopy = this.state.formRegister;
            stateCopy.dob.day = day;
            this.setState(stateCopy);
        };

        setYear = (year) => {
            var stateCopy = this.state.formRegister;
            stateCopy.dob.year = year;
            this.setState(stateCopy);
        };

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

        validateDateOfBirth = event => {
            var isNullDateOfBirth = this.state.formRegister.dob.day === '' 
                                || this.state.formRegister.dob.month === '' 
                                || this.state.formRegister.dob.year === '';

            if (!isNullDateOfBirth) {
                var DOB = new Date(this.state.formRegister.dob.year,
                                    this.state.formRegister.dob.month - 1,
                                    this.state.formRegister.dob.day),
                    today = new Date(),
                    isFutureDateOfBirth = DOB.getTime() > today.getTime();   
            }

            var stateCopy = this.state.formRegister;
            stateCopy.dob.error.isNull = isNullDateOfBirth ? true : false;
            stateCopy.dob.error.isInFuture = isFutureDateOfBirth ? true : false; 
            this.setState(stateCopy);
            return isNullDateOfBirth || isFutureDateOfBirth;
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
            return JSON.stringify({
                "defaultTimezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                "email": this.state.formRegister.email,
                "user": {
                    "firstName": this.state.formRegister.firstName,
                    "lastName": this.state.formRegister.lastName,
                    "birthDate": this.state.formRegister.dob.year
                        + "-" + this.state.formRegister.dob.month
                        + "-" + this.state.formRegister.dob.day,
                    "phone": this.cleanPhoneNumber(this.state.formRegister.phone),
                },
                "password": this.state.formRegister.password
            })
        }

        displayToast = (toastMessage, toastType, toastPosition) => toast(toastMessage, {
            type: toastType,
            position: toastPosition
        })

        onSubmit = e => {

            const form = e.target;

            const inputsToValidate = [
                'email',
                'firstName',
                'lastName',
                'phone',
                'password'
            ];

            const inputs = [...form.elements].filter(i => inputsToValidate.includes(i.name))

            const { errors, hasError } = FormValidator.bulkValidate(inputs)

            this.setState({
                [form.name]: {
                    ...this.state[form.name],
                    errors
                }
            });

            const invalidDOB = this.validateDateOfBirth();

            console.log((hasError || invalidDOB) ? 'Form has errors. Check!' : 'Form Submitted!')

            if (!hasError && !invalidDOB) {
                var result = send(this.constructRequestPayload());
                this.displayToast(
                    result.message, 
                    result.isSuccess ? "success" : "error", 
                    "bottom-center"
                );
                if (result.isSuccess) {
                    setTimeout(() => this.props.history.push('/register/complete'), 5000);
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
                            <img className="block-center" style={{marginLeft: 4 + 'px'}} src="img/logos/podstruct_text.svg" alt="Logo" />
                        </a>
                    </div>
                    <div className="card-body">
                        <p className="text-center py-2">CREATE YOUR PODSTRUCT ACCOUNT</p>
                        <form className="mb-3" name="formRegister" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputEmail1">Email address</label>
                                <div className="input-group with-focus">
                                    <Input 
                                        type="email"
                                        name="email"
                                        className="border-right-0"
                                        placeholder="Enter email"
                                        invalid={this.hasError('formRegister', 'email', 'required') || this.hasError('formRegister', 'email', 'email')}
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "email"]'
                                        value={this.state.formRegister.email} />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-envelope"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formRegister', 'email', 'required') && <span className="invalid-feedback">Email is required</span>}
                                    {this.hasError('formRegister', 'email', 'email') && <span className="invalid-feedback">Email must be a valid email</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputFirstName">First name</label>
                                <div className="input-group with-focus">
                                    <Input 
                                        type="text"
                                        id="id-firstName"
                                        name="firstName"
                                        className="border-right-0"
                                        placeholder="First name"
                                        invalid={
                                            this.hasError('formRegister', 'firstName', 'required')
                                            || this.hasError('formRegister', 'firstName', 'maxlen')
                                            || this.hasError('formRegister', 'firstName', 'contains-alpha')
                                            || this.hasError('formRegister', 'firstName', 'name')
                                            || this.hasError('formRegister', 'firstName', 'begin-end-spacing')
                                            || this.hasError('formRegister', 'firstName', 'consecutive-spacing')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "maxlen", "contains-alpha", "name", "begin-end-spacing", "consecutive-spacing"]'
                                        data-param='50'
                                        value={this.state.formRegister.firstName}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formRegister', 'firstName', 'required') && <span className="invalid-feedback">First name is required</span>}
                                    {this.hasError('formRegister', 'firstName', 'maxlen') && <span className="invalid-feedback">First name must not have more than 50 characters</span>}
                                    {this.hasError('formRegister', 'firstName', 'contains-alpha') && <span className="invalid-feedback">First name must contain at least one alpha character</span>}
                                    {this.hasError('formRegister', 'firstName', 'name') && <span className="invalid-feedback">First name must contain alpha, apostrophe, or hyphen characters only</span>}
                                    {this.hasError('formRegister', 'firstName', 'begin-end-spacing') && <span className="invalid-feedback">First name must not begin or end with a space character</span>}
                                    {this.hasError('formRegister', 'firstName', 'consecutive-spacing') && <span className="invalid-feedback">First name must not contain consecutive space characters</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputLastName">Last name</label>
                                <div className="input-group with-focus">
                                    <Input 
                                        type="text"
                                        id="id-lastName"
                                        name="lastName"
                                        className="border-right-0"
                                        placeholder="Last name"
                                        invalid={
                                            this.hasError('formRegister', 'lastName', 'required')
                                            || this.hasError('formRegister', 'lastName', 'maxlen')
                                            || this.hasError('formRegister', 'lastName', 'contains-alpha')
                                            || this.hasError('formRegister', 'lastName', 'name')
                                            || this.hasError('formRegister', 'lastName', 'begin-end-spacing')
                                            || this.hasError('formRegister', 'lastName', 'consecutive-spacing')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "maxlen", "contains-alpha", "name", "begin-end-spacing", "consecutive-spacing"]'
                                        data-param='50'
                                        value={this.state.formRegister.lastName}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-book"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formRegister', 'lastName', 'required') && <span className="invalid-feedback">Last name is required</span>}
                                    {this.hasError('formRegister', 'lastName', 'maxlen') && <span className="invalid-feedback">Last name must have not have more than 50 characters</span>}
                                    {this.hasError('formRegister', 'lastName', 'contains-alpha') && <span className="invalid-feedback">Last name must contain at least one alpha character</span>}
                                    {this.hasError('formRegister', 'lastName', 'name') && <span className="invalid-feedback">Last name must contain alpha, apostrophe, or hyphen characters only</span>}
                                    {this.hasError('formRegister', 'lastName', 'begin-end-spacing') && <span className="invalid-feedback">Last name must not begin or end with a space character</span>}
                                    {this.hasError('formRegister', 'lastName', 'consecutive-spacing') && <span className="invalid-feedback">Last name must not contain consecutive space characters</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputDOB">Date of birth</label>
                                <div className="input-group with-focus">
                                    <MonthSelector
                                        name="monthSelector"
                                        hasError={this.state.formRegister.dob.error.isNull || this.state.formRegister.dob.error.isInFuture}
                                        setMonth={(month) => this.setMonth(month)}
                                    />
                                    <DaySelector
                                        name="daySelector"
                                        hasError={this.state.formRegister.dob.error.isNull || this.state.formRegister.dob.error.isInFuture}
                                        setDay={(day) => this.setDay(day)}
                                    />
                                    <YearSelector
                                        name="yearSelector"
                                        hasError={this.state.formRegister.dob.error.isNull || this.state.formRegister.dob.error.isInFuture}
                                        setYear={(year) => this.setYear(year)}
                                    />
                                    {this.state.formRegister.dob.error.isNull && <p style={this.errorMessageStyling}>Date of birth is required</p>}
                                    {this.state.formRegister.dob.error.isInFuture && <p style={this.errorMessageStyling}>Date of birth must not be in the future</p>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputPhone">Phone number</label>
                                <div className="input-group with-focus">
                                    <Input 
                                        type="text"
                                        id="id-phone"
                                        name="phone"
                                        className="border-right-0"
                                        placeholder="Phone"
                                        invalid={
                                            this.hasError('formRegister', 'phone', 'required')
                                            || this.hasError('formRegister', 'phone', 'phone')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "phone"]'
                                        data-param='10'
                                        value={this.state.formRegister.phone}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-phone"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formRegister', 'phone', 'required') && <span className="invalid-feedback">Phone number is required</span>}
                                    {this.hasError('formRegister', 'phone', 'phone') && <span className="invalid-feedback">Phone number must contain exactly 10 digits</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputPassword1">Password</label>
                                <div className="input-group with-focus">
                                    <Input 
                                        type="password"
                                        id="id-password"
                                        name="password"
                                        className="border-right-0"
                                        placeholder="Password"
                                        invalid={
                                            this.hasError('formRegister', 'password', 'required')
                                            || this.hasError('formRegister', 'password', 'password')
                                        }
                                        onChange={this.validateOnChange}
                                        data-validate='["required", "password"]'
                                        value={this.state.formRegister.password}
                                        autoComplete='off'
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text text-muted bg-transparent border-left-0">
                                            <em className="fa fa-lock"></em>
                                        </span>
                                    </div>
                                    {this.hasError('formRegister', 'password', 'required') && <span className="invalid-feedback">Password is required</span>}
                                    {this.hasError('formRegister', 'password', 'password') &&
                                        <span className="invalid-feedback">
                                            Password must have at least 8 characters including each of one of the following:
                                            upper case, lower case, numeric and special character
                                        </span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-muted" htmlFor="signupInputRePassword1">Confirm Password</label>
                                <div className="input-group with-focus">
                                    <Input 
                                        type="password"
                                        name="confirmedPassword"
                                        className="border-right-0"
                                        placeholder="Retype password"
                                        invalid={this.hasError('formRegister', 'confirmedPassword', 'equalto')}
                                        onChange={this.validateOnChange}
                                        data-validate='["equalto"]'
                                        value={this.state.formRegister.confirmedPassword}
                                        data-param="id-password"
                                        autoComplete='off'
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
                            <ToastContainer />
                        </form>
                        <p className="pt-3 text-center">Already have an account?</p>
                        <Link to="/login" className="btn btn-block btn-secondary">Log in</Link>
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

export default Register;