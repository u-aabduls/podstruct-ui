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
import RoleSelector from '../../Common/RoleSelector';
import Swal from 'sweetalert2';
import FormValidator from '../FormValidator';
import { swalConfirm, dangerText, errorMessageStyling } from '../../../utils/Styles';

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
        getUserParams: {
            users: {
                name: '',
                page: 0,
                size: 0,
                sort: '',
                role: '',
                inviteStatus: 'ACCEPTED'
            },
            pending: {
                name: '',
                page: 0,
                size: 10,
                sort: '',
                role: '',
                inviteStatus: 'INVITED'
            }
        },
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

    validateSelectorsOnChange = e => {
        var isNullRole = this.state.formAddUser.role === '';
        var stateCopy = this.state.formAddUser;
        switch (e) {
            case "role":
                stateCopy.selector.error.isNullRole = isNullRole ? true : false;
                break;
            default:
                break;
        }
        this.setState(stateCopy);
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
        var successCount = 0;
        var errorMessage = "";
        var errorEmails = [];
        var all = [];
        if (!hasError && !invalidSelector) {
            this.state.formAddUser.email.replace(/\s/g, "").split(",").forEach((email) => {
                // only submit emails that are not empty strings from trailing commas
                if (email) {
                    var p = new Promise((resolve, reject) => {
                        var resp = createUser(this.state.pod.id, this.constructRequestPayload(email))
                        if (resp.isSuccess) {
                            successCount = successCount + 1
                            resolve(resp)
                        }
                        else {
                            errorEmails.push(email)
                            errorMessage = resp.message
                            reject(resp.message)
                        }
                    });
                    all.push(p);
                }
            })

            Promise.all(all).then(() => {
                this.toggleModal()
                Swal.fire({
                    title: "Successfully added " + successCount + " user(s)",
                    confirmButtonColor: swalConfirm(),
                    icon: "success",
                })
                let params = this.state.getUserParams.pending
                let res = getUsers(this.state.pod.id, params.name, params.page, params.size, params.sort, params.role, params.inviteStatus)
                this.props.updateOnAdd(res)
            }).catch(() => {
                Swal.fire({
                    title: "Emails could not be added",
                    icon: "error",
                    confirmButtonColor: swalConfirm(),
                    html: errorEmails.join(', ') + "<br><br>" + errorMessage
                })
                let params = this.state.getUserParams.pending
                let res = getUsers(this.state.pod.id, params.name, params.page, params.size, params.sort, params.role, params.inviteStatus)
                this.props.updateOnAdd(res)
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
                    <ModalHeader toggle={this.toggleModal}>Invite User</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="pod">Pod</label>
                            <Input
                                name="pod"
                                placeholder={this.state.pod.podName}
                                disabled={true}
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted" htmlFor="id-email">
                                Email <span style={dangerText()}>*</span>
                                <br />
                                <small>To add multiple users, separate email addresses by a comma</small>
                            </label>
                            <div className="input-group with-focus">
                                <Input
                                    type="text"
                                    id="id-email"
                                    name="email"
                                    className="border-right-0"
                                    placeholder="Enter user's email"
                                    invalid={
                                        this.hasError('formAddUser', 'email', 'required')
                                        || this.hasError('formAddUser', 'email', 'emails')
                                    }
                                    onChange={this.validateOnChange}
                                    data-validate='["required", "emails"]'
                                    value={this.state.formAddUser.email || ''} />
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
                            <label className="text-muted" htmlFor="AddUserMessage">Role <span style={dangerText()}>*</span></label>
                            <RoleSelector
                                hasError={this.state.formAddUser.selector.error.isNullRole}
                                setRole={(role) => this.setRole(role)}
                                validate={this.validateSelectorsOnChange}
                            />
                            {this.state.formAddUser.selector.error.isNullRole && <p style={errorMessageStyling()}>Role is required</p>}
                        </div>
                    </ModalBody>
                    <ModalFooter style={{ paddingBottom: '0' }}>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        <Button
                            color="primary"
                            type="submit"
                            onMouseDown={e => e.preventDefault()}
                        >
                            Invite
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        )
    }
}

export default AddUserForm