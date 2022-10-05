import React, { Component } from 'react';
import {
    Button,
    Table
} from 'reactstrap';
import { getUsers } from '../../connectors/PodUser';


class PodUserTable extends Component {

    state = {
        privileges: "owner",
        pod: this.props.pod,
        users: [],
        userPage: 0,
        userSize: 10,
        sortTypes: {
            asc: 'sort-up',
            desc: 'sort-down',
            default: 'sort',
        },
        currentSort: {
            fname: 'default',
            lname: 'default',
            role: 'default',
        },
        selectedSort: ''
    }

    nextUserPage = () => {
        if (this.state.users.length >= this.state.userSize) {
            var stateCopy = this.state
            var res = getUsers(this.state.pod.id, this.state.userPage + 1, this.state.userSize, this.state.selectedSort)
            if (res.isSuccess) {
                stateCopy.users = res.data.users
                stateCopy.userPage = this.state.userPage + 1
                this.setState(stateCopy)
            }
        }
    }

    prevUserPage = () => {
        if (this.state.userPage) {
            var stateCopy = this.state
            var res = getUsers(this.state.pod.id, this.state.userPage - 1, this.state.userSize, this.state.selectedSort)
            if (res.isSuccess) {
                stateCopy.users = res.data.users
                stateCopy.userPage = this.state.userPage - 1
                this.setState(stateCopy)
            }
        }
    }

    onSortChange = (header) => {
        const currentSort = this.state.currentSort;
        var nextSort;
        switch (header) {
            case "fname":
                if (currentSort[header] === 'desc') nextSort = 'asc';
                else if (currentSort[header] === 'asc') nextSort = 'default';
                else if (currentSort[header] === 'default') nextSort = 'desc';
                var res;
                var selectedSort;
                if (nextSort == 'default') selectedSort = '';
                else selectedSort = "firstName," + nextSort;
                res = getUsers(this.state.pod.id, this.state.userPage, this.state.userSize, selectedSort)
                this.setState({
                    users: res.data.users,
                    currentSort: {
                        fname: nextSort,
                        lname: 'default',
                        role: 'default',
                    },
                    selectedSort: selectedSort
                });
                break;
            case "lname":
                if (currentSort[header] === 'desc') nextSort = 'asc';
                else if (currentSort[header] === 'asc') nextSort = 'default';
                else if (currentSort[header] === 'default') nextSort = 'desc';
                var res;
                var selectedSort;
                if (nextSort == 'default') selectedSort = '';
                else selectedSort = "lastName," + nextSort;
                res = getUsers(this.state.pod.id, this.state.userPage, this.state.userSize, selectedSort)
                this.setState({
                    users: res.data.users,
                    currentSort: {
                        fname: 'default',
                        lname: nextSort,
                        role: 'default',
                    },
                    selectedSort: selectedSort
                });
                break;
            case "role":
                if (currentSort[header] === 'desc') nextSort = 'asc';
                else if (currentSort[header] === 'asc') nextSort = 'default';
                else if (currentSort[header] === 'default') nextSort = 'desc';
                var res;
                var selectedSort;
                if (nextSort == 'default') selectedSort = '';
                else selectedSort = "role," + nextSort;
                res = getUsers(this.state.pod.id, this.state.userPage, this.state.userSize, selectedSort)
                this.setState({
                    users: res.data.users,
                    currentSort: {
                        fname: 'default',
                        lname: 'default',
                        role: nextSort,
                    },
                    selectedSort: selectedSort
                });
                break;
        }

    }

    componentDidMount() {
        var stateCopy = this.state
        var res = getUsers(this.state.pod.id, 0, this.state.userSize, this.state.selectedSort)
        if (res.isSuccess) {
            stateCopy.users = res.data.users
            this.setState(stateCopy)
        }
    }

    render() {
        return (
            <div>
                <Table hover responsive ordering>
                    <thead>
                        <tr>
                            <th onClick={() => this.onSortChange("fname")}>
                                First Name
                                <i className={`fas fa-${this.state.sortTypes[this.state.currentSort.fname]} float-right`} />
                            </th>
                            <th onClick={() => this.onSortChange("lname")}>
                                Last Name
                                <i className={`fas fa-${this.state.sortTypes[this.state.currentSort.lname]} float-right`} />
                            </th>
                            <th>Email</th>
                            <th onClick={() => this.onSortChange("role")}>
                                Role
                                <i className={`fas fa-${this.state.sortTypes[this.state.currentSort.role]} float-right`} />
                            </th>
                        </tr>
                    </thead>
                    {this.state.users.length > 0 &&
                        this.state.users.map((user) => {
                            return (
                                <tbody>
                                    <tr>
                                        <td>
                                            {user.firstName}
                                        </td>
                                        <td>
                                            {user.lastName}
                                        </td>
                                        <td>
                                            {user.username}
                                        </td>
                                        <td>
                                            {user.role}
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        }
                        )
                    }
                </Table>
                <Button color="secondary" className="btn float-right mt-3" size="sm" onClick={this.nextUserPage}>
                    <span><i className="fa fa-chevron-right"></i></span>
                </Button>
                <Button color="secondary" className="btn float-right mt-3" size="sm" onClick={this.prevUserPage}>
                    <span><i className="fa fa-chevron-left"></i></span>
                </Button>
            </div>
        )
    }
}

export default PodUserTable