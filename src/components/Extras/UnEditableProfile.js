import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { CustomInput } from 'reactstrap';
import MonthSelector from "../Common/MonthSelector";
import DaySelector from "../Common/DaySelector";
import YearSelector from "../Common/YearSelector";
import { getUser } from "../../connectors/User";
import { disabledInputStyling } from '../../utils/Styles';

class UnEditableProfile extends Component {

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
        errorMessage: null
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

    componentDidMount() {
        this.setUserState();
    }

    render() {
        return (
            <div className="card-body">
                <form className="mb-3" name="personalInformation">
                    <div className="form-group">
                        <label>Picture</label>
                        <CustomInput
                            type="file"
                            id="disabled-field"
                            name="customFile"
                            disabled="disabled" />
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
                                id="disabled-field"
                                name="firstName"
                                className="border-right-0"
                                style={disabledInputStyling()}
                                placeholder="First name"
                                data-validate='["required", "maxlen", "contains-alpha", "name", "begin-end-spacing", "consecutive-spacing"]'
                                data-param='50'
                                value={this.state.personalInformation.firstName}
                                disabled="disabled"
                            />
                            <div className="input-group-append">
                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                    <em className="fa fa-book"></em>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="text-muted" htmlFor="signupInputLastName">Last name</label>
                        <div className="input-group with-focus">
                            <Input
                                type="text"
                                id="disabled-field"
                                name="lastName"
                                className="border-right-0"
                                style={disabledInputStyling()}
                                placeholder="Last name"
                                data-validate='["required", "maxlen", "contains-alpha", "name", "begin-end-spacing", "consecutive-spacing"]'
                                data-param='50'
                                value={this.state.personalInformation.lastName}
                                disabled="disabled"
                            />
                            <div className="input-group-append">
                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                    <em className="fa fa-book"></em>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="text-muted" htmlFor="signupInputPhone">Phone number</label>
                        <div className="input-group with-focus">
                            <Input
                                type="text"
                                id="disabled-field"
                                name="phone"
                                className="border-right-0"
                                style={disabledInputStyling()}
                                placeholder="Phone"
                                data-validate='["required", "phone"]'
                                data-param='10'
                                value={this.state.personalInformation.phone}
                                disabled="disabled"
                            />
                            <div className="input-group-append">
                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                    <em className="fa fa-phone"></em>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="text-muted" htmlFor="signupInputDOB">Date of birth</label>
                        <div className="input-group with-focus">
                            <MonthSelector
                                id="disabled-field"
                                defaultv={this.state.personalInformation.dob.month}
                                name="monthSelector"
                                disabled="disabled"
                            />
                            <DaySelector
                                id="disabled-field"
                                defaultv={this.state.personalInformation.dob.day}
                                name="daySelector"
                                disabled="disabled"
                            />
                            <YearSelector
                                id="disabled-field"
                                defaultv={this.state.personalInformation.dob.year}
                                name="yearSelector"
                                disabled="disabled"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Address</label>
                        <div className="input-group with-focus">
                            <Input
                                type="text"
                                id="disabled-field"
                                name="address"
                                className="border-right-0"
                                style={disabledInputStyling()}
                                placeholder="Address"
                                disabled="disabled"
                            />
                            <div className="input-group-append">
                                <span className="input-group-text text-muted bg-transparent border-left-0">
                                    <em className="fa fa-book"></em>
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default UnEditableProfile;


