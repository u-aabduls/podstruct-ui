import React, { Component } from 'react';
import {
    Input,
    CustomInput,
} from 'reactstrap';
import MonthSelector from "../Common/MonthSelector";
import DaySelector from "../Common/DaySelector";
import YearSelector from "../Common/YearSelector";
import { updateUser, getUser } from "../../connectors/User";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import FormValidator from '../Forms/FormValidator';

class EditableProfile extends Component {

    state = {
        personalInformation: {
            firstName: '',
            lastName: '',
            phone: '',
            dob: {
                month: '',
                day: '',
                year: '',
                error: {
                    isNull: false,
                    isInFuture: false
                }
            },
            address: '',
            status: '',
            userImageUrl: '',
            email: ''
        },
    }

    backendInfo = {
        firstName: '',
        lastName: '',
        phone: '',
        dob: {
            month: '',
            day: '',
            year: '',
        },
    };

    changedInputStyling = {
        color: '#f0ad4e',
        width: '100%',
        marginTop: '0.5rem',
        fontSize: '80%'
    }

    setMonth = (month) => {
        var stateCopy = this.state.personalInformation;
        stateCopy.dob.month = month;
        this.setState(stateCopy);
    };

    setDay = (day) => {
        var stateCopy = this.state.personalInformation;
        stateCopy.dob.day = day;
        this.setState(stateCopy);
    };

    setYear = (year) => {
        var stateCopy = this.state.personalInformation;
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
        var isNullDateOfBirth = this.state.personalInformation.dob.day === ''
            || this.state.personalInformation.dob.month === ''
            || this.state.personalInformation.dob.year === '';

        if (!isNullDateOfBirth) {
            var DOB = new Date(this.state.personalInformation.dob.year,
                this.state.personalInformation.dob.month - 1,
                this.state.personalInformation.dob.day),
                today = new Date(),
                isFutureDateOfBirth = DOB.getTime() > today.getTime();
        }

        var stateCopy = this.state.personalInformation;
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
            "firstName": this.state.personalInformation.firstName,
            "lastName": this.state.personalInformation.lastName,
            "birthDate": this.state.personalInformation.dob.year
                + "-" + this.state.personalInformation.dob.month
                + "-" + this.state.personalInformation.dob.day,
            "phone": this.cleanPhoneNumber(this.state.personalInformation.phone),
        })

    }

    onSubmit = e => {
        e.preventDefault();

        const form = e.target;

        const inputsToValidate = [
            'firstName',
            'lastName',
            'phone',
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
            var res = updateUser(this.constructRequestPayload());
            if (res.isSuccess) {
                this.props.toggleEdit()
                Swal.fire({
                    title: "Successfully edited profile",
                    icon: "success",
                })
            } else {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: res.message
                })
            }

        }
    }

    setUserState() {
        var result = getUser();
        if (result.isSuccess) {
            var stateCopy = this.state;
            var dob = result.data.birthDate.split("-");
            stateCopy.personalInformation.email = result.data.username;
            stateCopy.personalInformation.firstName = result.data.firstName;
            stateCopy.personalInformation.lastName = result.data.lastName;
            stateCopy.personalInformation.phone = result.data.phone.substring(1);
            stateCopy.personalInformation.dob.month = dob[1];
            stateCopy.personalInformation.dob.day = dob[2];
            stateCopy.personalInformation.dob.year = dob[0];
            stateCopy.personalInformation.address = result.data.address;
            stateCopy.personalInformation.status = result.data.status;
            this.backendInfo = JSON.parse(JSON.stringify(stateCopy.personalInformation));
            this.setState(stateCopy);
        }
    }

    // resetUserState() {
    //     this.state.personalInformation.firstName = this.backendInfo.firstName;
    //     this.state.personalInformation.lastName = this.backendInfo.lastName;
    //     this.state.personalInformation.phone = this.backendInfo.phone;
    //     this.state.personalInformation.dob.month = this.backendInfo.dob.month;
    //     this.state.personalInformation.dob.day = this.backendInfo.dob.day;
    //     this.state.personalInformation.dob.year = this.backendInfo.dob.year;
    // }

    componentDidMount() {
        this.setUserState();
    }

    render() {
        return (
            <div className="card-body">
                <form className="mb-3" name="personalInformation" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Picture</label>
                        <CustomInput type="file" id="exampleCustomFileBrowser" name="customFile" />
                    </div>
                    <div className="form-group">
                        <label className="text-muted" htmlFor="signupInputEmail1">Email address</label>
                        <div className="input-group with-focus">
                            <Input
                                type="email"
                                name="email"
                                className="border-right-0"
                                placeholder={this.state.personalInformation.email}
                                disabled="disabled" />
                            <div className="input-group-append">
                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                    <em className="fa fa-envelope"></em>
                                </span>
                            </div>
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
                                    this.hasError('personalInformation', 'firstName', 'required')
                                    || this.hasError('personalInformation', 'firstName', 'maxlen')
                                    || this.hasError('personalInformation', 'firstName', 'contains-alpha')
                                    || this.hasError('personalInformation', 'firstName', 'name')
                                    || this.hasError('personalInformation', 'firstName', 'begin-end-spacing')
                                    || this.hasError('personalInformation', 'firstName', 'consecutive-spacing')
                                }
                                onChange={this.validateOnChange}
                                data-validate='["required", "maxlen", "contains-alpha", "name", "begin-end-spacing", "consecutive-spacing"]'
                                data-param='50'
                                value={this.state.personalInformation.firstName}
                            />
                            <div className="input-group-append">
                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                    <em className="fa fa-book"></em>
                                </span>
                            </div>
                            {(this.backendInfo.firstName !== this.state.personalInformation.firstName) && <span style={this.changedInputStyling}>This field's current value differs from our records.</span>}
                            {this.hasError('personalInformation', 'firstName', 'required') && <span className="invalid-feedback">First name is required</span>}
                            {this.hasError('personalInformation', 'firstName', 'maxlen') && <span className="invalid-feedback">First name must not have more than 50 characters</span>}
                            {this.hasError('personalInformation', 'firstName', 'contains-alpha') && <span className="invalid-feedback">First name must contain at least one alpha character</span>}
                            {this.hasError('personalInformation', 'firstName', 'name') && <span className="invalid-feedback">First name must contain alpha, apostrophe, or hyphen characters only</span>}
                            {this.hasError('personalInformation', 'firstName', 'begin-end-spacing') && <span className="invalid-feedback">First name must not begin or end with a space character</span>}
                            {this.hasError('personalInformation', 'firstName', 'consecutive-spacing') && <span className="invalid-feedback">First name must not contain consecutive space characters</span>}
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
                                    this.hasError('personalInformation', 'lastName', 'required')
                                    || this.hasError('personalInformation', 'lastName', 'maxlen')
                                    || this.hasError('personalInformation', 'lastName', 'contains-alpha')
                                    || this.hasError('personalInformation', 'lastName', 'name')
                                    || this.hasError('personalInformation', 'lastName', 'begin-end-spacing')
                                    || this.hasError('personalInformation', 'lastName', 'consecutive-spacing')
                                }
                                onChange={this.validateOnChange}
                                data-validate='["required", "maxlen", "contains-alpha", "name", "begin-end-spacing", "consecutive-spacing"]'
                                data-param='50'
                                value={this.state.personalInformation.lastName}
                            />
                            <div className="input-group-append">
                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                    <em className="fa fa-book"></em>
                                </span>
                            </div>
                            {(this.backendInfo.lastName !== this.state.personalInformation.lastName) && <span style={this.changedInputStyling}>This field's current value differs from our records.</span>}
                            {this.hasError('personalInformation', 'lastName', 'required') && <span className="invalid-feedback">Last name is required</span>}
                            {this.hasError('personalInformation', 'lastName', 'maxlen') && <span className="invalid-feedback">Last name must have not have more than 50 characters</span>}
                            {this.hasError('personalInformation', 'lastName', 'contains-alpha') && <span className="invalid-feedback">Last name must contain at least one alpha character</span>}
                            {this.hasError('personalInformation', 'lastName', 'name') && <span className="invalid-feedback">Last name must contain alpha, apostrophe, or hyphen characters only</span>}
                            {this.hasError('personalInformation', 'lastName', 'begin-end-spacing') && <span className="invalid-feedback">Last name must not begin or end with a space character</span>}
                            {this.hasError('personalInformation', 'lastName', 'consecutive-spacing') && <span className="invalid-feedback">Last name must not contain consecutive space characters</span>}
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
                                    this.hasError('personalInformation', 'phone', 'required')
                                    || this.hasError('personalInformation', 'phone', 'phone-digits')
                                }
                                onChange={this.validateOnChange}
                                data-validate='["required", "phone-digits"]'
                                data-param='10'
                                value={this.state.personalInformation.phone}
                            />
                            <div className="input-group-append">
                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                    <i className="fa fa-phone"></i>
                                </span>
                            </div>
                            {(this.backendInfo.phone !== this.state.personalInformation.phone) && <span style={this.changedInputStyling}>This field's current value differs from our records.</span>}
                            {this.hasError('personalInformation', 'phone', 'required') && <span className="invalid-feedback">Phone number is required</span>}
                            {this.hasError('personalInformation', 'phone', 'phone-digits') && <span className="invalid-feedback">Phone number must contain exactly 10 digits</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="text-muted" htmlFor="signupInputDOB">Date of birth</label>
                        <div className="input-group with-focus">
                            <MonthSelector
                                defaultv={this.state.personalInformation.dob.month}
                                name="monthSelector"
                                hasError={this.state.personalInformation.dob.error.isNull || this.state.personalInformation.dob.error.isInFuture}
                                setMonth={(month) => this.setMonth(month)}
                            />
                            <DaySelector
                                defaultv={this.state.personalInformation.dob.day}
                                name="daySelector"
                                hasError={this.state.personalInformation.dob.error.isNull || this.state.personalInformation.dob.error.isInFuture}
                                setDay={(day) => this.setDay(day)}
                            />
                            <YearSelector
                                defaultv={this.state.personalInformation.dob.year}
                                name="yearSelector"
                                hasError={this.state.personalInformation.dob.error.isNull || this.state.personalInformation.dob.error.isInFuture}
                                setYear={(year) => this.setYear(year)}
                            />
                            {(this.backendInfo.dob.month !== this.state.personalInformation.dob.month ||
                                this.backendInfo.dob.day !== this.state.personalInformation.dob.day ||
                                this.backendInfo.dob.year !== this.state.personalInformation.dob.year) &&
                                <span style={this.changedInputStyling}>This field's current value differs from our records.</span>}
                            {this.state.personalInformation.dob.error.isNull && <p style={this.errorMessageStyling}>Date of birth is required</p>}
                            {this.state.personalInformation.dob.error.isInFuture && <p style={this.errorMessageStyling}>Date of birth must not be in the future</p>}
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
                            />
                            <div className="input-group-append">
                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                    <em className="fa fa-book"></em>
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-info" type="submit">Save Changes</button>
                </form>
            </div>
        );
    }

}

export default EditableProfile;


