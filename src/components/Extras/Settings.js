import React, { Component } from 'react';
import { Input } from 'reactstrap';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, TabContent, TabPane, ListGroup, ListGroupItem, CustomInput } from 'reactstrap';
import MonthSelector from "../Common/MonthSelector";
import DaySelector from "../Common/DaySelector";
import YearSelector from "../Common/YearSelector";
import { updateUser, getUser } from "../../connectors/User";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormValidator from '../Forms/FormValidator.js';

class Settings extends Component {

    state = {
        activeTab: 'profile',
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
        }
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

    displayToast = (toastMessage, toastType, toastPosition) => toast(toastMessage, {
        type: toastType,
        position: toastPosition
    })

    onSubmit = e => {

        const form = e.target;

        const inputsToValidate = [
            'firstName',
            'lastName',
            'phone',
        ];

        const inputs = [...form.elements].filter(i => inputsToValidate.includes(i.name))
        console.log(inputs)
        console.log(inputs['firstName'])

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
            var result = updateUser(this.constructRequestPayload());
            this.displayToast(
                result.message,
                result.isSuccess ? "success" : "error",
                "bottom-center"
            );
            if (result.isSuccess) {
                //setTimeout(() => this.props.history.push('/dashboard'), 5000);
            }
        }

        e.preventDefault();
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    componentDidMount() {
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

    render() {
        return (
            <ContentWrapper>
                <div className="container-md mx-0">
                    <Row>
                        <Col lg="3">
                            <div className="card b">
                                <div className="card-header bg-gray-lighter text-bold">Personal Settings</div>
                                <ListGroup>
                                    <ListGroupItem action
                                        className={this.state.activeTab === 'profile' ? 'active' : ''}
                                        onClick={() => { this.toggleTab('profile'); }}>
                                        Personal Information
                                    </ListGroupItem>
                                    <ListGroupItem action
                                        className={this.state.activeTab === 'account' ? 'active' : ''}
                                        onClick={() => { this.toggleTab('account'); }}>
                                        Privacy and Security
                                    </ListGroupItem>
                                    <ListGroupItem action
                                        className={this.state.activeTab === 'payments' ? 'active' : ''}
                                        onClick={() => { this.toggleTab('account'); }}>
                                        Payments and Subscriptions
                                    </ListGroupItem>
                                    <ListGroupItem action
                                        className={this.state.activeTab === 'emails' ? 'active' : ''}
                                        onClick={() => { this.toggleTab('emails'); }}>
                                        Email
                                    </ListGroupItem>
                                    <ListGroupItem action
                                        className={this.state.activeTab === 'notifications' ? 'active' : ''}
                                        onClick={() => { this.toggleTab('notifications'); }}>
                                        Notifications
                                    </ListGroupItem>
                                    <ListGroupItem action
                                        className={this.state.activeTab === 'applications' ? 'active' : ''}
                                        onClick={() => { this.toggleTab('applications'); }}>
                                        Applications
                                    </ListGroupItem>
                                </ListGroup>
                            </div>
                        </Col>
                        <Col lg="9">
                            <TabContent activeTab={this.state.activeTab} className="p-0 b0">
                                <TabPane tabId="profile">
                                    <div className="card b">
                                        <div className="card-header bg-gray-lighter text-bold">Profile</div>
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
                                                            readOnly />
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
                                                                || this.hasError('personalInformation', 'phone', 'phone')
                                                            }
                                                            onChange={this.validateOnChange}
                                                            data-validate='["required", "phone"]'
                                                            data-param='10'
                                                            value={this.state.personalInformation.phone}
                                                        />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text text-muted bg-transparent border-left-0">
                                                                <em className="fa fa-phone"></em>
                                                            </span>
                                                        </div>
                                                        {(this.backendInfo.phone !== this.state.personalInformation.phone) && <span style={this.changedInputStyling}>This field's current value differs from our records.</span>}
                                                        {this.hasError('personalInformation', 'phone', 'required') && <span className="invalid-feedback">Phone number is required</span>}
                                                        {this.hasError('personalInformation', 'phone', 'phone') && <span className="invalid-feedback">Phone number must contain exactly 10 digits</span>}
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
                                                        {(this.backendInfo.dob.month !== this.state.personalInformation.dob.month) && <span style={this.changedInputStyling}>This field's current value differs from our records.</span>}
                                                        {(this.backendInfo.dob.day !== this.state.personalInformation.dob.day) && <span style={this.changedInputStyling}>This field's current value differs from our records.</span>}
                                                        {(this.backendInfo.dob.year !== this.state.personalInformation.dob.year) && <span style={this.changedInputStyling}>This field's current value differs from our records.</span>}
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
                                                <button className="btn btn-info" type="submit">Update Information</button>
                                            </form>
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tabId="account">
                                    <div className="card b">
                                        <div className="card-header bg-gray-lighter text-bold">Account</div>
                                        <div className="card-body">
                                            <form action="">
                                                <div className="form-group">
                                                    <label>Current password</label>
                                                    <input className="form-control" type="password" />
                                                </div>
                                                <div className="form-group">
                                                    <label>New password</label>
                                                    <input className="form-control" type="password" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Confirm new password</label>
                                                    <input className="form-control" type="password" />
                                                </div>
                                                <button className="btn btn-info" type="button">Update password</button>
                                                <p>
                                                    <small className="text-muted">* Integer fermentum accumsan metus, id sagittis ipsum molestie vitae</small>
                                                </p>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="card b">
                                        <div className="card-header bg-danger text-bold">Delete account</div>
                                        <div className="card-body bt">
                                            <p>You will be asked for confirmation before delete account.</p>
                                            <button className="btn btn-secondary" type="button">
                                                <span className="text-danger">Delete account</span>
                                            </button>
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tabId="emails">
                                    <div className="card b">
                                        <div className="card-header bg-gray-lighter text-bold">Emails</div>
                                        <div className="card-body">
                                            <p>Etiam eros nibh, condimentum in auctor et, aliquam quis elit. Donec id libero eros. Ut fringilla, justo id fringilla pretium, nibh nunc suscipit mauris, et suscipit nulla nisl ac dolor. Nam egestas, leo eu gravida tincidunt, sem ipsum pellentesque quam, vel iaculis est quam et eros.</p>
                                            <p>
                                                <strong>Your email addresses</strong>
                                            </p>
                                            <p>
                                                <span className="mr-2">email@someaddress.com</span>
                                                <span className="badge badge-success">primary</span>
                                            </p>
                                            <p>
                                                <span className="mr-2">another.email@someaddress.com</span>
                                                <span className="badge bg-gray">private</span>
                                            </p>
                                        </div>
                                        <div className="card-body bt">
                                            <p>
                                                <strong>Add email address</strong>
                                            </p>
                                            <form action="">
                                                <Row className="mb-2">
                                                    <Col xl="6">
                                                        <div className="form-group">
                                                            <div className="input-group">
                                                                <input className="form-control" type="email" placeholder="email@server.com" />
                                                                <span className="input-group-btn">
                                                                    <button className="btn btn-secondary" type="button">Add</button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" id="defaultCheck1" type="checkbox" value="" />
                                                            <label className="form-check-label">Keep my email address private</label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <button className="btn btn-info" type="button">Update email</button>
                                                <p>
                                                    <small className="text-muted">* Integer fermentum accumsan metus, id sagittis ipsum molestie vitae</small>
                                                </p>
                                            </form>
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tabId="notifications">
                                    <form action="">
                                        <div className="card b">
                                            <div className="card-header bg-gray-lighter text-bold">Notifications</div>
                                            <div className="card-body bb">
                                                <div className="form-check">
                                                    <input className="form-check-input" id="defaultCheck2" type="checkbox" value="" />
                                                    <label className="form-check-label">
                                                        <strong>Disable email notifications</strong>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <p>
                                                    <strong>Interaction</strong>
                                                </p>
                                                <div className="form-check">
                                                    <input className="form-check-input" id="defaultCheck3" type="checkbox" value="" />
                                                    <label className="form-check-label">Alert me when someone start to follow me</label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" id="defaultCheck4" type="checkbox" value="" />
                                                    <label className="form-check-label">Alert me when someone star my work</label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" id="defaultCheck5" type="checkbox" value="" />
                                                    <label className="form-check-label">Alert me when post a new comment</label>
                                                </div>
                                                <p className="my-2">
                                                    <strong>Marketing</strong>
                                                </p>
                                                <div className="form-check mb-2">
                                                    <input className="form-check-input" id="defaultCheck6" type="checkbox" value="" />
                                                    <label className="form-check-label">Send me news and interesting updates</label>
                                                </div>
                                                <button className="mb-3 btn btn-info" type="button">Update notifications</button>
                                                <p>
                                                    <small className="text-muted">Mauris sodales accumsan erat, ut dapibus erat faucibus vitae.</small>
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                </TabPane>
                                <TabPane tabId="applications">
                                    <div className="card b">
                                        <div className="card-header bg-gray-lighter text-bold">Applications</div>
                                        <div className="card-body">
                                            <p>
                                                <span>You have granted access for</span>
                                                <strong>3 applications</strong>
                                                <span>to your account.</span>
                                            </p>
                                            <ListGroup>
                                                <ListGroupItem className="d-flex align-items-center">
                                                    <img className="mr-2 img-fluid thumb48" src="img/dummy.png" alt="App" />
                                                    <div>
                                                        <p className="text-bold mb-0">Application #1</p>
                                                        <small>Ut turpis urna, tristique sed adipiscing nec, luctus quis leo.</small>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <button className="btn btn-secondary" type="button">
                                                            <strong>Revoke</strong>
                                                        </button>
                                                    </div>
                                                </ListGroupItem>
                                                <ListGroupItem className="d-flex align-items-center">
                                                    <img className="mr-2 img-fluid thumb48" src="img/dummy.png" alt="App" />
                                                    <div>
                                                        <p className="text-bold mb-0">Application #2</p>
                                                        <small>Ut turpis urna, tristique sed adipiscing nec, luctus quis leo.</small>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <button className="btn btn-secondary" type="button">
                                                            <strong>Revoke</strong>
                                                        </button>
                                                    </div>
                                                </ListGroupItem>
                                                <ListGroupItem className="d-flex align-items-center">
                                                    <img className="mr-2 img-fluid thumb48" src="img/dummy.png" alt="App" />
                                                    <div>
                                                        <p className="text-bold mb-0">Application #3</p>
                                                        <small>Ut turpis urna, tristique sed adipiscing nec, luctus quis leo.</small>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <button className="btn btn-secondary" type="button">
                                                            <strong>Revoke</strong>
                                                        </button>
                                                    </div>
                                                </ListGroupItem>
                                            </ListGroup>
                                        </div>
                                    </div>
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </div>
            </ContentWrapper>
        );
    }

}

export default Settings;


