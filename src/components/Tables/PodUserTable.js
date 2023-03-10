import React, { Component } from 'react';
import {
    Button,
    Table,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Row,
    Col
} from 'reactstrap';
import { getUsers, deleteUser } from '../../connectors/PodUser';
import { resendInvite } from '../../connectors/PodUserInvite';
import { isAdmin, isTeacher, isStudent } from '../../utils/PermissionChecker'
import Swal from 'sweetalert2';
import { swalConfirm } from '../../utils/Styles';

class PodUserTable extends Component {

    state = {
        rolePerms: this.props.pod.roleInPod,
        pod: this.props.pod,
        users: [],
        pending: [],
        getUserParams: {
            users: {
                name: '',
                page: 0,
                size: 10,
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
        sortTypes: {
            asc: 'sort-up',
            desc: 'sort-down',
            default: 'sort',
        },
        currentSort: {
            users: {
                fname: 'default',
                lname: 'default',
                role: 'default',
            },
            pending: {
                fname: 'default',
                lname: 'default',
                role: 'default',
            }
        },
        nextPage: {
            users: true,
            pending: true
        }
    }

    toggleDD = dd => {
        this.setState({
            [dd]: !this.state[dd]
        })
    }

    resendInvite = (username) => {
        var res = resendInvite(this.state.pod.id, username)
        if (res.isSuccess) {
            Swal.fire({
                title: "Resent Invitation",
                icon: "success",
                confirmButtonColor: swalConfirm()
            })
        }
        else {
            Swal.fire({
                title: "Error",
                icon: "error",
                confirmButtonColor: swalConfirm(),
                text: res.message
            })
        }
    }

    deleteUser = (user) => {
        if (user.inviteStatus === 'ACCEPTED') {
            Swal.fire({
                title: 'Remove ' + user.firstName + ' ' + user.lastName + ' from pod?',
                text: 'All of their progress will be lost. This action can\'t be undone',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: swalConfirm(),
                confirmButtonText: 'Remove',
            }).then((result) => {
                if (result.isConfirmed) {
                    var stateCopy = this.state
                    var res = deleteUser(this.state.pod.id, user.username)
                    if (res.isSuccess) {
                        var params = this.state.getUserParams.users
                        res = getUsers(this.state.pod.id, params.name, params.page, params.size, params.sort, params.role, params.inviteStatus)
                        if (res.isSuccess) {
                            stateCopy.users = res.data.users
                            this.setState(stateCopy)
                        }
                    }
                    Swal.fire({
                        title: 'Successfully deleted user from the pod',
                        icon: 'success',
                        confirmButtonColor: swalConfirm()
                    })
                }
            })
        }
        else {
            Swal.fire({
                title: 'Revoke invitation?',
                text: 'The user will not be able to join without an invitation',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: swalConfirm(),
                confirmButtonText: 'Revoke',
            }).then((result) => {
                if (result.isConfirmed) {
                    var stateCopy = this.state
                    var res = deleteUser(this.state.pod.id, user.username)
                    if (res.isSuccess) {
                        var params = this.state.getUserParams.pending
                        res = getUsers(this.state.pod.id, params.name, params.page, params.size, params.sort, params.role, params.inviteStatus)
                        if (res.isSuccess) {
                            stateCopy.pending = res.data.users
                            this.setState(stateCopy)
                        }
                    }
                    Swal.fire({
                        title: 'Successfully revoked invitation',
                        icon: 'success',
                        confirmButtonColor: swalConfirm()
                    })
                }
            })
        }
    }

    nextUserPage = (table) => {
        if (this.state[table].length >= this.state.getUserParams[table].size) {
            var stateCopy = this.state
            var params = this.state.getUserParams[table]
            var res = getUsers(this.state.pod.id, params.name, params.page + 1, params.size, params.sort, params.role, params.inviteStatus)
            if (res.data.users.length > 0) {
                stateCopy[table] = res.data.users
                stateCopy.getUserParams[table].page = this.state.getUserParams[table].page + 1
            }
            else stateCopy.nextPage[table] = false;
            this.setState(stateCopy)
        }
    }

    prevUserPage = (table) => {
        if (this.state.getUserParams[table].page) {
            var stateCopy = this.state
            var params = this.state.getUserParams[table]
            var res = getUsers(this.state.pod.id, params.name, params.page - 1, params.size, params.sort, params.role, params.inviteStatus)
            if (res.isSuccess) {
                stateCopy[table] = res.data.users
                stateCopy.getUserParams[table].page = this.state.getUserParams[table].page - 1
                this.setState(stateCopy)
            }
        }
    }

    onSortChange = (table, header) => {
        var nextSort, res, getUserParams, currentSort;
        getUserParams = this.state.getUserParams[table];
        currentSort = this.state.currentSort[table];
        if (currentSort[header] === 'desc') nextSort = 'asc';
        else if (currentSort[header] === 'asc') nextSort = 'default';
        else if (currentSort[header] === 'default') nextSort = 'desc';
        switch (header) {
            case "lname":
                if (nextSort === 'default') getUserParams.sort = '';
                else getUserParams.sort = "lastName," + nextSort;
                var params = getUserParams
                res = getUsers(this.state.pod.id, params.name, params.page, params.size, params.sort, params.role, params.inviteStatus)
                this.setState({
                    [table]: res.data.users,
                    getUserParams: {
                        ...this.state.getUserParams,
                        [table]: {
                            ...this.state.getUserParams[table],
                            sort: getUserParams.sort
                        }
                    },
                    currentSort: {
                        ...this.state.currentSort,
                        [table]: {
                            lname: nextSort,
                            role: 'default'
                        },

                    }
                });
                break;
            case "role":
                if (nextSort === 'default') getUserParams.sort = '';
                else getUserParams.sort = "role," + nextSort;
                params = getUserParams
                res = getUsers(this.state.pod.id, params.name, params.page, params.size, params.sort, params.role, params.inviteStatus)
                this.setState({
                    [table]: res.data.users,
                    getUserParams: {
                        ...this.state.getUserParams,
                        [table]: {
                            ...this.state.getUserParams[table],
                            sort: getUserParams.sort
                        }
                    },
                    currentSort: {
                        ...this.state.currentSort,
                        [table]: {
                            lname: 'default',
                            role: nextSort,
                        },

                    }
                });
                break;
            default:
                break;
        }
    }

    handleUserSearchChange = event => {
        this.setState({
            getUserParams: {
                ...this.state.getUserParams,
                "users": {
                    ...this.state.getUserParams["users"],
                    name: event.target.value
                }
            },
        })
    }

    handlePendingSearchChange = event => {
        this.setState({
            getUserParams: {
                ...this.state.getUserParams,
                "pending": {
                    ...this.state.getUserParams["pending"],
                    name: event.target.value
                }
            },
        })
    }

    debounce = (fn, delay) => {
        let timerId;
        return (...args) => {
            clearTimeout(timerId);
            timerId = setTimeout(fn, delay, [...args]);
        };
    };

    filterRequest = this.debounce((table) => {
        var stateCopy = this.state
        var params = this.state.getUserParams[table];
        var res = getUsers(this.state.pod.id, params.name, params.page, params.size, params.sort, params.role, params.inviteStatus)
        if (res.isSuccess) {
            stateCopy[table] = res.data.users
            this.setState(stateCopy)
        }
    }, 500);

    componentWillMount() {
        var stateCopy = this.state
        var params = this.state.getUserParams.users
        var res = getUsers(this.state.pod.id, params.name, params.page, params.size, params.sort, params.role, params.inviteStatus)
        if (res.isSuccess) {
            stateCopy.users = res.data.users
            this.setState(stateCopy)
        }
        params = this.state.getUserParams.pending
        res = getUsers(this.state.pod.id, params.name, params.page, params.size, params.sort, params.role, params.inviteStatus)
        if (res.isSuccess) {
            stateCopy.pending = res.data.users
            this.setState(stateCopy)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.users !== prevProps.users) {
            this.setState({ users: this.props.users })
        }
        if (this.props.pending !== prevProps.pending) {
            this.setState({ pending: this.props.pending })
        }
        if (prevState.getUserParams.users.name !== this.state.getUserParams.users.name) {
            this.filterRequest("users");
        }
        if (prevState.getUserParams.pending.name !== this.state.getUserParams.pending.name) {
            this.filterRequest("pending");
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <h4 className="mt-3">Users</h4>
                    <Col sm="2">
                        <div className="form-group mt-2">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Search users by name"
                                value={this.state.getUserParams.users.name}
                                onChange={this.handleUserSearchChange}
                            />
                        </div>
                    </Col>
                </Row>

                <Table hover responsive ordering striped>
                    <thead>
                        <tr>
                            {/* <th onClick={() => this.onSortChange("fname")}>
                                First Name
                                <i className={`fas fa-${this.state.sortTypes[this.state.currentSort.fname]} float-right`} />
                            </th>
                            <th onClick={() => this.onSortChange("lname")}>
                                Last Name
                                <i className={`fas fa-${this.state.sortTypes[this.state.currentSort.lname]} float-right`} />
                            </th>
                            <th>Email</th> */}
                            <th onClick={() => this.onSortChange('users', 'lname')}>
                                User
                                <i className={`fas fa-${this.state.sortTypes[this.state.currentSort.users.lname]} float-right`} />
                            </th>
                            <th onClick={() => this.onSortChange('users', 'role')}>
                                Role
                                <i className={`fas fa-${this.state.sortTypes[this.state.currentSort.users.role]} float-right`} />
                            </th>
                        </tr>
                    </thead>
                    {this.state.users.length > 0 ?
                        this.state.users.map((user, i) => {
                            return (
                                <tbody>
                                    <tr>
                                        {/* <td>
                                                {user.firstName}
                                            </td>
                                            <td>
                                                {user.lastName}
                                            </td>
                                            <td>
                                                {user.username}
                                            </td> */}
                                        <td>
                                            {user.firstName} {user.lastName}
                                            <br />
                                            <small>{user.username}</small>
                                        </td>
                                        <td>
                                            {<ButtonDropdown isOpen={this.state[`ddRole${i}`]} toggle={() => this.toggleDD(`ddRole${i}`)}>
                                                <DropdownToggle disabled={!isAdmin(this.state.rolePerms) || isAdmin(user.role)} caret size="sm" style={{ width: "130px" }}>
                                                    {user.role}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    {isStudent(user.role) ?
                                                        <DropdownItem>Teacher</DropdownItem>
                                                        : null}
                                                    {isTeacher(user.role) ?
                                                        <DropdownItem>Student</DropdownItem>
                                                        : null}
                                                </DropdownMenu>
                                            </ButtonDropdown>}
                                        </td>
                                        <td className="buttons">
                                            {isAdmin(this.state.rolePerms) && !isAdmin(user.role) ?
                                                <div className='button-container'>
                                                    <Button
                                                        className="btn btn-secondary btn-sm bg-danger"
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={() => this.deleteUser(user)}
                                                    >
                                                        <i className="fas fa-trash-alt fa-fw btn-icon"></i>
                                                    </Button>
                                                </div>
                                                : null
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        }
                        )
                        :
                        <tr>
                            <td colspan="2" className='text-center pt-5 pb-4'>
                                <h3>No Users</h3>
                            </td>
                        </tr>}
                </Table>
                <div>
                    {this.state.nextPage.users && this.state.users.length >= this.state.getUserParams.users.size ?
                        <Button color="secondary" className="btn float-right mt-3 mb-5" size="sm" onClick={() => this.nextUserPage('users')}>
                            <span><i className="fa fa-chevron-right"></i></span>
                        </Button>
                        :
                        <Button color="secondary" className="btn float-right mt-3 mb-5 invisible" size="sm" onClick={() => this.nextUserPage('users')}>
                            <span><i className="fa fa-chevron-right"></i></span>
                        </Button>}
                    {this.state.getUserParams.users.page > 0 ?
                        <Button color="secondary" className="btn float-right mt-3 mb-5" size="sm" onClick={() => this.prevUserPage('users')}>
                            <span><i className="fa fa-chevron-left"></i></span>
                        </Button>
                        :
                        <Button color="secondary" className="btn float-right mt-3 mb-5 invisible" size="sm" onClick={() => this.prevUserPage('users')}>
                            <span><i className="fa fa-chevron-left"></i></span>
                        </Button>}
                </div>
                <Row>
                    <h4 className="mt-5 pt-2">Pending Invites</h4>
                    <Col sm="2">
                        <div className="form-group mt-4 pt-4">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Search users by name"
                                value={this.state.getUserParams.pending.name}
                                onChange={this.handlePendingSearchChange}
                            />
                        </div>
                    </Col>
                </Row>
                <Table hover responsive ordering striped>
                    <thead>
                        <tr>
                            {/* <th onClick={() => this.onSortChange("fname")}>
                                First Name
                                <i className={`fas fa-${this.state.sortTypes[this.state.currentSort.fname]} float-right`} />
                            </th>
                            <th onClick={() => this.onSortChange("lname")}>
                                Last Name
                                <i className={`fas fa-${this.state.sortTypes[this.state.currentSort.lname]} float-right`} />
                            </th>
                            <th>Email</th> */}
                            {/* <th onClick={() => this.onSortChange('pending', 'lname')}> */}
                            <th>
                                User
                                {/* <i className={`fas fa-${this.state.sortTypes[this.state.currentSort.pending.lname]} float-right`} /> */}
                            </th>
                            <th onClick={() => this.onSortChange('pending', 'role')}>
                                Role
                                <i className={`fas fa-${this.state.sortTypes[this.state.currentSort.pending.role]} float-right`} />
                            </th>
                        </tr>
                    </thead>
                    {this.state.pending.length > 0 ?
                        this.state.pending.map((user, i) => {
                            return (
                                <tbody>
                                    <tr>
                                        {/* <td>
                                                {user.firstName}
                                            </td>
                                            <td>
                                                {user.lastName}
                                            </td>
                                            <td>
                                                {user.username}
                                            </td> */}
                                        <td>
                                            {user.firstName} {user.lastName}
                                            <br />
                                            <small>{user.username}</small>
                                        </td>
                                        <td>
                                            {user.role}
                                        </td>
                                        <td className="buttons">
                                            {isAdmin(this.state.rolePerms) ?
                                                <div className='button-container'>
                                                    <Button className="btn btn-secondary btn-sm"
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={() => this.resendInvite(user.username)}>
                                                        Resend Invite
                                                    </Button>
                                                </div>
                                                : null
                                            }
                                        </td>
                                        <td className="buttons">
                                            {isAdmin(this.state.rolePerms) ?
                                                <div className='button-container'>
                                                    <Button className="btn btn-secondary btn-sm bg-danger"
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={() => this.deleteUser(user)}>
                                                        Revoke Invite
                                                    </Button>
                                                </div>
                                                : null
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        })
                        : <tr>
                            <td colspan="2" className='text-center pt-5 pb-4'>
                                <h3>No Users</h3>
                            </td>
                        </tr>
                    }
                </Table >
                <div>
                    {this.state.nextPage.pending && this.state.pending.length >= this.state.getUserParams.pending.size ?
                        <Button color="secondary" className="btn float-right mt-3 mb-5" size="sm" onClick={() => this.nextUserPage('pending')}>
                            <span><i className="fa fa-chevron-right"></i></span>
                        </Button>
                        :
                        <Button color="secondary" className="btn float-right mt-3 mb-5 invisible" size="sm" onClick={() => this.nextUserPage('pending')}>
                            <span><i className="fa fa-chevron-right"></i></span>
                        </Button>}
                    {this.state.getUserParams.pending.page > 0 ?
                        <Button color="secondary" className="btn float-right mt-3 mb-5" size="sm" onClick={() => this.prevUserPage('pending')}>
                            <span><i className="fa fa-chevron-left"></i></span>
                        </Button>
                        :
                        <Button color="secondary" className="btn float-right mt-3 mb-5 invisible" size="sm" onClick={() => this.prevUserPage('pending')}>
                            <span><i className="fa fa-chevron-left"></i></span>
                        </Button>}
                </div>
            </div>
        )
    }
}

export default PodUserTable