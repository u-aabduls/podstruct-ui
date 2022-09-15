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
    Table,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

import EditPodForm from './EditPodForm';
import Now from '../../Common/Now';

class PodDetail extends Component {

    state = {
        privileges: "owner",
        pod: this.props.location.state,
        editModal: false,
        annModal: false,
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

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    updateOnEdit = (res) => {
        if (res.isSuccess) {
            this.setState({
                pod: res.data
            })
        }
    }

    render() {
        return (
            <ContentWrapper>
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
                                {this.state.privileges === "owner" &&
                                    <DropdownItem onClick={this.toggleEditModal}>Edit Pod</DropdownItem>
                                }
                            </DropdownMenu>
                        </Dropdown>
                        <EditPodForm
                            pod={this.state.pod}
                            modal={this.state.editModal}
                            toggle={this.toggleEditModal}
                            updateOnEdit={this.updateOnEdit}
                        />
                    </div>
                </div>
                <Row noGutters={true}>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body">
                                <h4 className="mt-1 text-muted">Pod Name</h4>
                                <p className="text-primary font-weight-bold">{this.state.pod.podName}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body">
                                <h4 className="mt-1 text-muted">Pod Description</h4>
                                <p className="text-primary font-weight-bold">{this.state.pod.podDescription}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body">
                                <h4 className="mt-1 text-muted">My Role</h4>
                                <p className="text-primary font-weight-bold">{this.state.pod.roleInPod}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body">
                                <h4 className="mt-1 text-muted">Pod Owner</h4>
                                <p className="text-primary font-weight-bold">{this.state.pod.roleInPod}</p>
                            </div>
                        </div>
                        {/* END card */}
                    </Col>
                    <Col>
                        {/* START card */}
                        <div className="card-fixed-height">
                            <div className="card-body">
                                <h4 className="mt-1 text-muted">Contact Information</h4>
                                <p className="text-primary font-weight-bold">{this.state.pod.roleInPod}</p>
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
                                                className={classnames({ active: this.state.activeTab === '1' })}
                                                onClick={() => { this.toggleTab('1'); }}>
                                                Announcements
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === '2' })}
                                                onClick={() => { this.toggleTab('2'); }}>
                                                Assignments
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === '3' })}
                                                onClick={() => { this.toggleTab('3'); }}>
                                                Upcoming Events
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    {/* Tab panes */}
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="1">
                                            {this.state.privileges === "owner" &&
                                                <div className="float-right">
                                                    <Button className="btn btn-secondary btn-sm" onClick={this.toggleAnnModal}>Add Announcement</Button>
                                                </div>
                                            }
                                            {/* <AddAnnouncementForm
                                                course={this.state.course}
                                                modal={this.state.annModal}
                                            /> */}
                                            <Table hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>

                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className='date'>
                                                            <Now format="dddd" className="text-uppercase text-bold" />
                                                            <br />
                                                            <Now format="h:mm" className="h2 mt0 text-sm" />
                                                            <Now format="a" className="text-muted text-sm" />
                                                        </td>
                                                        <td className="announcement">
                                                            <span className="h4 text-bold">Midterm grades released</span>
                                                            <br />
                                                            <span>Please email me for any inquiries about your grade</span>
                                                        </td>
                                                        <td className="buttons">
                                                            {this.state.privileges === "owner" &&
                                                                <div className='button-container'>
                                                                    <Button className="btn btn-secondary btn-sm bg-success">
                                                                        <i className="fas fa-edit fa-fw btn-icon"></i>
                                                                    </Button>
                                                                    <Button className="btn btn-secondary btn-sm bg-danger">
                                                                        <i className="fas fa-trash-alt fa-fw btn-icon"></i>
                                                                    </Button>
                                                                </div>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className='date'>
                                                            <Now format="dddd" className="text-uppercase text-bold" />
                                                            <br />
                                                            <Now format="h:mm" className="h2 mt0 text-sm" />
                                                            <Now format="a" className="text-muted text-sm" />
                                                        </td>
                                                        <td className="announcement">
                                                            <span className="h4 text-bold">Final grades released</span>
                                                        </td>
                                                        <td className="buttons">
                                                            {this.state.privileges === "owner" &&
                                                                <div className='button-container'>
                                                                    <Button className="btn btn-secondary btn-sm bg-success">
                                                                        <i className="fas fa-edit fa-fw btn-icon"></i>
                                                                    </Button>
                                                                    <Button className="btn btn-secondary btn-sm bg-danger">
                                                                        <i className="fas fa-trash fa-fw btn-icon"></i>
                                                                    </Button>
                                                                </div>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className='date'>
                                                            <Now format="dddd" className="text-uppercase text-bold" />
                                                            <br />
                                                            <Now format="h:mm" className="h2 mt0 text-sm" />
                                                            <Now format="a" className="text-muted text-sm" />
                                                        </td>
                                                        <td className="announcement">
                                                            <span className="h4 text-bold">Assignment 4 Due</span>
                                                            <br />
                                                            <span>Please submit before 12 AM</span>
                                                        </td>
                                                        <td className="buttons">
                                                            {this.state.privileges === "owner" &&
                                                                <div className='button-container'>
                                                                    <Button className="btn btn-secondary btn-sm bg-success">
                                                                        <i className="fas fa-edit fa-fw btn-icon"></i>
                                                                    </Button>
                                                                    <Button className="btn btn-secondary btn-sm bg-danger">
                                                                        <i className="fas fa-trash fa-fw btn-icon"></i>
                                                                    </Button>
                                                                </div>
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </TabPane>
                                        <TabPane tabId="2">Integer lobortis commodo auctor.</TabPane>
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