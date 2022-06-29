import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { CustomInput } from 'reactstrap';
import MonthSelector from "../Common/MonthSelector";
import DaySelector from "../Common/DaySelector";
import YearSelector from "../Common/YearSelector";

class UnEditableProfile extends Component {

    render() {
        return (
            <>
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
                            placeholder={this.props.state.personalInformation.email}
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
                            placeholder="First name"
                            invalid={
                                this.props.hasError('personalInformation', 'firstName', 'required')
                                || this.props.hasError('personalInformation', 'firstName', 'maxlen')
                                || this.props.hasError('personalInformation', 'firstName', 'contains-alpha')
                                || this.props.hasError('personalInformation', 'firstName', 'name')
                                || this.props.hasError('personalInformation', 'firstName', 'begin-end-spacing')
                                || this.props.hasError('personalInformation', 'firstName', 'consecutive-spacing')
                            }
                            onChange={this.props.validateOnChange}
                            data-validate='["required", "maxlen", "contains-alpha", "name", "begin-end-spacing", "consecutive-spacing"]'
                            data-param='50'
                            value={this.props.state.personalInformation.firstName}
                            disabled="disabled"
                        />
                        <div className="input-group-append">
                            <span className="input-group-text text-muted bg-transparent border-left-0">
                                <em className="fa fa-book"></em>
                            </span>
                        </div>
                        {(this.props.backendInfo.firstName !== this.props.state.personalInformation.firstName) && <span style={this.props.changedInputStyling}>this.props field's current value differs from our records.</span>}
                        {this.props.hasError('personalInformation', 'firstName', 'required') && <span className="invalid-feedback">First name is required</span>}
                        {this.props.hasError('personalInformation', 'firstName', 'maxlen') && <span className="invalid-feedback">First name must not have more than 50 characters</span>}
                        {this.props.hasError('personalInformation', 'firstName', 'contains-alpha') && <span className="invalid-feedback">First name must contain at least one alpha character</span>}
                        {this.props.hasError('personalInformation', 'firstName', 'name') && <span className="invalid-feedback">First name must contain alpha, apostrophe, or hyphen characters only</span>}
                        {this.props.hasError('personalInformation', 'firstName', 'begin-end-spacing') && <span className="invalid-feedback">First name must not begin or end with a space character</span>}
                        {this.props.hasError('personalInformation', 'firstName', 'consecutive-spacing') && <span className="invalid-feedback">First name must not contain consecutive space characters</span>}
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
                            placeholder="Last name"
                            invalid={
                                this.props.hasError('personalInformation', 'lastName', 'required')
                                || this.props.hasError('personalInformation', 'lastName', 'maxlen')
                                || this.props.hasError('personalInformation', 'lastName', 'contains-alpha')
                                || this.props.hasError('personalInformation', 'lastName', 'name')
                                || this.props.hasError('personalInformation', 'lastName', 'begin-end-spacing')
                                || this.props.hasError('personalInformation', 'lastName', 'consecutive-spacing')
                            }
                            onChange={this.props.validateOnChange}
                            data-validate='["required", "maxlen", "contains-alpha", "name", "begin-end-spacing", "consecutive-spacing"]'
                            data-param='50'
                            value={this.props.state.personalInformation.lastName}
                            disabled="disabled"
                        />
                        <div className="input-group-append">
                            <span className="input-group-text text-muted bg-transparent border-left-0">
                                <em className="fa fa-book"></em>
                            </span>
                        </div>
                        {(this.props.backendInfo.lastName !== this.props.state.personalInformation.lastName) && <span style={this.props.changedInputStyling}>this.props field's current value differs from our records.</span>}
                        {this.props.hasError('personalInformation', 'lastName', 'required') && <span className="invalid-feedback">Last name is required</span>}
                        {this.props.hasError('personalInformation', 'lastName', 'maxlen') && <span className="invalid-feedback">Last name must have not have more than 50 characters</span>}
                        {this.props.hasError('personalInformation', 'lastName', 'contains-alpha') && <span className="invalid-feedback">Last name must contain at least one alpha character</span>}
                        {this.props.hasError('personalInformation', 'lastName', 'name') && <span className="invalid-feedback">Last name must contain alpha, apostrophe, or hyphen characters only</span>}
                        {this.props.hasError('personalInformation', 'lastName', 'begin-end-spacing') && <span className="invalid-feedback">Last name must not begin or end with a space character</span>}
                        {this.props.hasError('personalInformation', 'lastName', 'consecutive-spacing') && <span className="invalid-feedback">Last name must not contain consecutive space characters</span>}
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
                            placeholder="Phone"
                            invalid={
                                this.props.hasError('personalInformation', 'phone', 'required')
                                || this.props.hasError('personalInformation', 'phone', 'phone')
                            }
                            onChange={this.props.validateOnChange}
                            data-validate='["required", "phone"]'
                            data-param='10'
                            value={this.props.state.personalInformation.phone}
                            disabled="disabled"
                        />
                        <div className="input-group-append">
                            <span className="input-group-text text-muted bg-transparent border-left-0">
                                <em className="fa fa-phone"></em>
                            </span>
                        </div>
                        {(this.props.backendInfo.phone !== this.props.state.personalInformation.phone) && <span style={this.props.changedInputStyling}>this.props field's current value differs from our records.</span>}
                        {this.props.hasError('personalInformation', 'phone', 'required') && <span className="invalid-feedback">Phone number is required</span>}
                        {this.props.hasError('personalInformation', 'phone', 'phone') && <span className="invalid-feedback">Phone number must contain exactly 10 digits</span>}
                    </div>
                </div>
                <div className="form-group">
                    <label className="text-muted" htmlFor="signupInputDOB">Date of birth</label>
                    <div className="input-group with-focus">
                        <MonthSelector
                            id="disabled-field"
                            defaultv={this.props.state.personalInformation.dob.month}
                            name="monthSelector"
                            hasError={this.props.state.personalInformation.dob.error.isNull || this.props.state.personalInformation.dob.error.isInFuture}
                            setMonth={(month) => this.props.setMonth(month)}
                            disabled="disabled"
                        />
                        <DaySelector
                            id="disabled-field"
                            defaultv={this.props.state.personalInformation.dob.day}
                            name="daySelector"
                            hasError={this.props.state.personalInformation.dob.error.isNull || this.props.state.personalInformation.dob.error.isInFuture}
                            setDay={(day) => this.props.setDay(day)}
                            disabled="disabled"
                        />
                        <YearSelector
                            id="disabled-field"
                            defaultv={this.props.state.personalInformation.dob.year}
                            name="yearSelector"
                            hasError={this.props.state.personalInformation.dob.error.isNull || this.props.state.personalInformation.dob.error.isInFuture}
                            setYear={(year) => this.props.setYear(year)}
                            disabled="disabled"
                        />
                        {(this.props.backendInfo.dob.month !== this.props.state.personalInformation.dob.month ||
                            this.props.backendInfo.dob.day !== this.props.state.personalInformation.dob.day ||
                            this.props.backendInfo.dob.year !== this.props.state.personalInformation.dob.year) &&
                            <span style={this.props.changedInputStyling}>this.props field's current value differs from our records.</span>}
                        {this.props.state.personalInformation.dob.error.isNull && <p style={this.props.errorMessageStyling}>Date of birth is required</p>}
                        {this.props.state.personalInformation.dob.error.isInFuture && <p style={this.props.errorMessageStyling}>Date of birth must not be in the future</p>}
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
            </>
        );
    }

}

export default UnEditableProfile;


