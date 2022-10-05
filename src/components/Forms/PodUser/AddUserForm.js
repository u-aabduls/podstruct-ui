import React, { Component } from 'react';
import {
    Button,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import { createUser, getUsers } from '../../../connectors/PodUser';
import PodSelector from '../../Common/PodSelector';
import RoleSelector from '../../Common/RoleSelector';
import Swal from 'sweetalert2';
import FormValidator from '../FormValidator';
import { responsiveArray } from 'antd/lib/_util/responsiveObserve';

class AddUserForm extends Component {

    state = {
        formAddUser: {
            email: '',
            role: '',
            selector: {
                error: {
                    isNullRole: false,
                }
            }
        },
        pod: this.props.pod,
        modal: false,
    }

    toggleModal = () => {
        this.setState({
            formAddUser: {
                email: '',
                role: '',
                selector: {
                    error: {
                        isNullRole: false,
                    }
                }
            },
        });
        this.props.toggle()
    }

    errorMessageStyling = {
        color: '#f05050',
        width: '100%',
        marginTop: '0.25rem',
        fontSize: '80%'
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

    validateSelectors = event => {
        var isNullRole = this.state.formAddUser.role === '';

        var stateCopy = this.state.formAddUser;
        stateCopy.selector.error.isNullRole = isNullRole ? true : false;
        this.setState(stateCopy);
        return isNullRole
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return this.state[formName] &&
            this.state[formName].errors &&
            this.state[formName].errors[inputName] &&
            this.state[formName].errors[inputName][method]
    }

    constructRequestPayload = (email) => {
        var payload = {
            "email": email,
            "role": this.state.formAddUser.role
        };
        return JSON.stringify(payload);
    }

    setRole = (role) => {
        var stateCopy = this.state.formAddUser;
        stateCopy.role = role
        this.setState(stateCopy);
    };

    onSubmit = e => {
        e.preventDefault();

        const form = e.target;

        const inputsToValidate = [
            'email',
            'role',
        ];

        const inputs = [...form.elements].filter(i => inputsToValidate.includes(i.name))

        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                errors
            }
        });

        const invalidSelector = this.validateSelectors();

        console.log((hasError || invalidSelector) ? 'Form has errors. Check!' : 'Form Submitted!')
        var successCount = 0
        var errorMessage = ""
        var all = []
        if (!hasError && !invalidSelector) {
            this.state.formAddUser.email.replace(/\s/g, "").split(",").map((email) => {
                var p = new Promise((resolve, reject) => {
                    var resp = createUser(this.state.pod.id, this.constructRequestPayload(email))
                    if (resp.isSuccess) {
                        successCount = successCount + 1
                        resolve(resp)
                    }
                    else {
                        errorMessage = resp.message
                        reject(resp.message)
                    }
                });
                all.push(p);
            })

            Promise.all(all).then(() => {
                if (!errorMessage) {
                    this.toggleModal()
                    Swal.fire({
                        title: "Successfully added " + successCount + " user(s)",
                        icon: "success",
                    })
                    var res = getUsers(this.state.pod.id, 0, 10, "")
                    this.props.updateOnAdd(res)
                }
                else {
                    Swal.fire({
                        title: "Error, Successfully added " + successCount + " user(s)",
                        icon: "error",
                        text: errorMessage
                    })
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.modal !== prevProps.modal) {
            this.setState({ modal: this.props.modal })
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal}>
                <form className="mb-3" name="formAddUser" onSubmit={this.onSubmit}>
                    <ModalHeader toggle={this.toggleModal}>Add User</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="podSelector">Select Pod</label>
                            <PodSelector
                                name="podSelector"
                                defaultV={this.state.pod}
                                disabled={true}
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="AddUserEmail">Email</label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    name="email"
                                    className="border-right-0"
                                    placeholder="Enter user's email"
                                    invalid={
                                        this.hasError('formAddUser', 'email', 'required')
                                        || this.hasError('formAddUser', 'email', 'emails')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["required", "emails"]'
                                    value={this.state.formAddUser.email} />
                                <div className="input-group-append">
                                    <span className="input-group-text text-muted bg-transparent border-left-0">
                                        <em className="fa fa-book"></em>
                                    </span>
                                </div>
                                {this.hasError('formAddUser', 'email', 'required') && <span className="invalid-feedback">Email is required</span>}
                                {this.hasError('formAddUser', 'email', 'emails') && <span className="invalid-feedback">All emails must be valid emails</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="AddUserMessage">Role</label>
                            <RoleSelector
                                hasError={this.state.formAddUser.selector.error.isNullRole}
                                setRole={(role) => this.setRole(role)}
                            />
                            {this.state.formAddUser.selector.error.isNullRole && <p style={this.errorMessageStyling}>Role is required</p>}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        <Button color="primary" type="submit">Add User</Button>{' '}
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}

export default AddUserForm