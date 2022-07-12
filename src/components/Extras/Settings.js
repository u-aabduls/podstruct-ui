import React, { Component } from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, TabContent, TabPane, ListGroup, ListGroupItem, CustomInput, Button } from 'reactstrap';
import EditableProfile from "./EditableProfile"
import UnEditableProfile from './UnEditableProfile';
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
        },
        editMode: false,
        editButtonText: "Edit",
        errorMessage: null
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

    onEditChange = () => {
        if (this.state.editMode) {
            this.resetUserState();
            this.setState({ editButtonText: "Edit" })
            this.setState({ editMode: false })
        }
        else {
            this.setState({ editButtonText: "Cancel" })
            this.setState({ editMode: true })
        }
    }

    onSubmit = e => {

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
            var result = updateUser(this.constructRequestPayload());
            if (result.isSuccess) {
                this.setState({ errorMessage: null });
                this.displayToast(result.message, "success", "bottom-center");
                this.setUserState();
                this.setState({ editButtonText: "Edit" })
                this.setState({ editMode: false })
            } else {
                this.setState({ errorMessage: result.message });
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

    resetUserState() {
        this.state.personalInformation.firstName = this.backendInfo.firstName;
        this.state.personalInformation.lastName = this.backendInfo.lastName;
        this.state.personalInformation.phone = this.backendInfo.phone;
        this.state.personalInformation.dob.month = this.backendInfo.dob.month;
        this.state.personalInformation.dob.day = this.backendInfo.dob.day;
        this.state.personalInformation.dob.year = this.backendInfo.dob.year;
    }

    componentDidMount() {
        this.setUserState();
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
                                        My Profile
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
                                        <div className="card-header bg-gray-lighter text-bold">Profile
                                            <Col md={13}>
                                                <Button color="info" className="btn float-right" onClick={this.onEditChange}>{this.state.editButtonText}</Button>
                                            </Col>
                                        </div>
                                        <div className="card-body">
                                            <form className="mb-3" name="personalInformation" onSubmit={this.onSubmit}>
                                                {this.state.editMode ?
                                                    <>
                                                        <EditableProfile
                                                            state={this.state}
                                                            backendInfo={this.backendInfo}
                                                            errorMessageStyling={this.errorMessageStyling}
                                                            changedInputStyling={this.changedInputStyling}
                                                            setDay={this.setDay}
                                                            setMonth={this.setMonth}
                                                            setYear={this.setYear}
                                                            hasError={this.hasError}
                                                            validateOnChange={this.validateOnChange}
                                                        />
                                                        <button className="btn btn-info" type="submit">Save Changes</button>
                                                    </>
                                                    :
                                                    <>
                                                        <UnEditableProfile
                                                            state={this.state}
                                                            backendInfo={this.backendInfo}
                                                            errorMessageStyling={this.errorMessageStyling}
                                                            changedInputStyling={this.changedInputStyling}
                                                            setDay={this.setDay}
                                                            setMonth={this.setMonth}
                                                            setYear={this.setYear}
                                                            hasError={this.hasError}
                                                            validateOnChange={this.validateOnChange}
                                                        />
                                                        <button className="btn btn-info" disabled>Save Changes</button>
                                                        <ToastContainer />
                                                    </>
                                                }
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


