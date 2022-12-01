import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import {
    Button,
    Dropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Row,
    Card,
    CardBody,
    Col,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import { getPod } from '../../../connectors/Pod';
import AddAnnouncementForm from '../../Forms/Announcement/AddAnnouncementForm';
import EditPodForm from '../../Forms/Pod/EditPodForm';
import AddUserForm from '../../Forms/PodUser/AddUserForm';
import InvitedPodForm from '../../Forms/PodUser/InvitedPodForm';
import PodUserTable from '../../Tables/PodUserTable';
import PodAnnouncementsTable from '../../Tables/PodAnnouncementsTable';
import { isAdmin } from '../../../utils/PermissionChecker';

class PodDetail extends Component {

    state = {
        rolePerms: '',
        pod: '',
        pending: [],
        editModal: false,
        annModal: false,
        userModal: false,
        ddOpen: false,
        activeTab: '1',
    }

    toggleDD = () => this.setState({
        ddOpen: !this.state.ddOpen
    })

    toggleEditModal = () => {
        this.setState({
            editModal: !this.state.editModal
        });
    }

    toggleAnnModal = () => {
        this.setState({
            annModal: !this.state.annModal
        });
    }

    toggleUserModal = () => {
        this.setState({
            userModal: !this.state.userModal
        });
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }

    }

    updateOnPodEdit = (res) => {
        if (res.isSuccess) {
            this.setState({
                pod: res.data
            })
        }
    }

    updateOnAnnouncementAdd = (res) => {
        if (res.isSuccess) {
            this.setState({
                announcements: res.data.announcements,
                lastEvaluatedKey: res.data.lastEvaluatedKey
            })
        }
    }

    updateOnUserAdd = (res) => {
        if (res.isSuccess) {
            this.setState({
                pending: res.data.users,
            })
        }
    }

    componentWillMount() {
        var stateCopy = this.state;
        var res = getPod(this.props.match.params.id)
        if (res.isSuccess) {
            stateCopy.pod = res.data
            stateCopy.rolePerms = res.data.roleInPod
            this.setState(stateCopy)
        }
    }

    render() {
        return (
            <ContentWrapper>
                <InvitedPodForm
                    pod={this.state.pod}
                    modal={this.state.pod.inviteStatus === 'INVITED'}
                />
                <div className="content-heading">
                    <div>Pod Details
                        <small>Check out the details and edit a specific Pod</small>
                    </div>

                    <div className="ml-auto">
                        <Dropdown isOpen={this.state.ddOpen} toggle={this.toggleDD}>
                            <DropdownToggle>
                                <em className="fas fa-ellipsis-v fa-lg"></em>
                            </DropdownToggle>
                            <DropdownMenu>
                                {isAdmin(this.state.rolePerms) ?
                                    <DropdownItem onClick={this.toggleEditModal}>Edit Pod</DropdownItem>
                                    : null
                                }
                                <DropdownItem onClick={() => this.props.history.push('/courses', { pod:  this.state.pod})}>Courses</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <EditPodForm
                            pod={this.state.pod}
                            modal={this.state.editModal}
                            toggle={this.toggleEditModal}
                            updateOnEdit={this.updateOnPodEdit}
                        />
                    </div>
                </div>
                <Button className="btn btn-secondary mb-3 mt-2 font-weight-bold" onClick={() => this.props.history.goBack()}>
                    <i className="fas fa-arrow-left fa-fw btn-icon"></i>
                    Go back
                </Button>
                <Row noGutters={true}>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">Pod Name</h4>
                                <p className="text-primary font-weight-bold">{this.state.pod.podName}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">Pod Description</h4>
                                <p className="text-primary font-weight-bold">{this.state.pod.podDescription}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">My Role</h4>
                                <p className="text-primary font-weight-bold">{this.state.pod.roleInPod}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">Pod Owner</h4>
                                {/* <p className="text-primary font-weight-bold">{this.state.pod.roleInPod}</p> */}
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                                <h4 className="mt-1 text-muted">Contact Information</h4>
                                <p className="text-primary font-weight-bold">
                                    Address: {this.state.pod.address}
                                </p>
                                <p className="text-primary font-weight-bold">
                                    Phone Number: {this.state.pod.phone}
                                </p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md={12}>
                        <Card className="card">
                            <CardBody>
                                <div role="tabpanel">
                                    {/* Nav tabs */}
                                    <Nav tabs>
                                        <NavItem>
                                            <NavLink
                                                href="#"
                                                className={classnames({ active: this.state.activeTab === '1' })}
                                                onClick={() => { this.toggleTab('1'); }}>
                                                Announcements
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#"
                                                className={classnames({ active: this.state.activeTab === '2' })}
                                                onClick={() => { this.toggleTab('2'); }}>
                                                Users
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                href="#"
                                                className={classnames({ active: this.state.activeTab === '3' })}
                                                onClick={() => { this.toggleTab('3'); }}>
                                                Courses
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    {/* Tab panes */}
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="1">
                                            {isAdmin(this.state.rolePerms) ?
                                                <div className="float-right">
                                                    <button className="btn btn-success btn-sm mb-3 mt-2" onClick={this.toggleAnnModal}>
                                                        <em className="fa fa-plus-circle fa-sm button-create-icon"></em>
                                                        Add Announcement
                                                    </button>
                                                </div>
                                                : null
                                            }
                                            <AddAnnouncementForm
                                                pod={this.state.pod}
                                                modal={this.state.annModal}
                                                updateOnAdd={this.updateOnAnnouncementAdd}
                                                toggle={this.toggleAnnModal}
                                            />
                                            <PodAnnouncementsTable
                                                pod={this.state.pod}
                                                announcements={this.state.announcements}
                                                lastEvaluatedKey={this.state.lastEvaluatedKey}
                                            />
                                        </TabPane>
                                        <TabPane tabId="2">
                                            {isAdmin(this.state.rolePerms) ?
                                                <div className="float-right">
                                                    <button className="btn btn-success btn-sm mb-3 mt-2" onClick={this.toggleUserModal}>
                                                        <em className="fa fa-plus-circle fa-sm button-create-icon"></em>
                                                        Add User
                                                    </button>
                                                </div>
                                                : null
                                            }
                                            <AddUserForm
                                                pod={this.state.pod}
                                                modal={this.state.userModal}
                                                updateOnAdd={this.updateOnUserAdd}
                                                toggle={this.toggleUserModal}
                                            />
                                            <PodUserTable
                                                pod={this.state.pod}
                                                pending={this.state.pending}
                                            />
                                        </TabPane>
                                        <TabPane tabId="3">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</TabPane>
                                        <TabPane tabId="4">Sed commodo tellus ut mi tristique pharetra.</TabPane>
                                    </TabContent>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </ContentWrapper>
        )
    }

}

export default withRouter(PodDetail)