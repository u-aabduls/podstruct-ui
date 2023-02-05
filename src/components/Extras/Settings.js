import React, { Component } from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, TabContent, TabPane, ListGroup, ListGroupItem, CustomInput, Button } from 'reactstrap';
import EditableProfile from "./EditableProfile"
import UnEditableProfile from './UnEditableProfile';
import 'react-toastify/dist/ReactToastify.css';

class Settings extends Component {

    state = {
        activeTab: 'profile',
        editMode: false,
        editButtonText: "Edit",
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    onEditChange = () => {
        if (this.state.editMode) {
            // this.resetUserState();
            this.setState({ editButtonText: "Edit" })
            this.setState({ editMode: false })
        }
        else {
            this.setState({ editButtonText: "Cancel" })
            this.setState({ editMode: true })
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
                                                <Button color="primary" 
                                                        className="btn float-right"
                                                        onMouseDown={e => e.preventDefault()} 
                                                        onClick={this.onEditChange}
                                                >           {this.state.editButtonText}
                                                </Button>
                                            </Col>
                                        </div>
                                        {this.state.editMode ?
                                            <EditableProfile
                                                editMode={this.state.editMode}
                                                toggleEdit={this.onEditChange}
                                            />
                                            :
                                            <UnEditableProfile
                                                editMode={this.state.editMode}
                                            />
                                        }
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
                                                <button className="btn btn-info" 
                                                        type="button"
                                                        onMouseDown={e => e.preventDefault()} 
                                                    >Update password</button>
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
                                            <button className="btn btn-secondary" 
                                                    type="button"
                                                    onMouseDown={e => e.preventDefault()} 
                                                >
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


