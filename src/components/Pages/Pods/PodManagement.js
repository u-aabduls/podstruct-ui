import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Row, Col } from 'reactstrap';
import { getPods } from "../../../connectors/Pod";
import PodCard from './PodCard';
import { Divider } from '@material-ui/core';
import AddPodForm from '../../Forms/Pod/AddPodForm';

class PodManagement extends Component {

    state = {
        pods: [],
        pendingPods: [],
        getPodParams: {
            accepted: {
                inviteStatus: 'ACCEPTED'
            },
            pending: {
                inviteStatus: 'INVITED'
            }
        },
        addPodModal: false
    }

    contentHeadingStyle = {
        marginBottom: `1rem`,
        justifyContent: `space-between`
    }

    toggleAddPodModal = () => {
        this.setState({
            addPodModal: !this.state.addPodModal
        });
    }

    getLatestPods = () => {
        var params = this.state.getPodParams.accepted;
        var result = getPods(params.inviteStatus).data;
        if (result) {
            result.sort(function (a, b) {
                return (a.podName).localeCompare(b.podName);
            })
            this.setState({ pods: result });
        }
        params = this.state.getPodParams.pending;
        result = getPods(params.inviteStatus).data;
        if (result) {
            result.sort(function (a, b) {
                return (a.podName).localeCompare(b.podName);
            })
            this.setState({ pendingPods: result });
        }
    }

    componentWillMount() {
       this.getLatestPods();
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading" style={this.contentHeadingStyle}>
                    <div>
                        Pods
                        <small>View and create pods</small>
                    </div>
                    <div>
                        <button className="btn btn-success"
                            onMouseDown={e => e.preventDefault()}
                            onClick={this.toggleAddPodModal}>
                            <em className="fa fa-plus-circle fa-sm button-create-icon"></em> Create Pod
                        </button>
                        <AddPodForm
                            modal={this.state.addPodModal}
                            toggle={this.toggleAddPodModal}
                            updateOnAdd={this.getLatestPods}
                        />
                    </div>
                </div>
                {this.state.pendingPods.length > 0 ? <h3>Invitations</h3> : null}
                <Row className={`${this.state.pendingPods.length > 0 && "mb-5"}`}>
                    {this.state.pendingPods.map(function (object, i) {
                        return (
                            object.active ?
                                <Col key={i} xl="4" lg="6">
                                    {/* <PodCard
                                    name={object.podName}
                                    description={object.podDescription}
                                    role={object.roleInPod}
                                    courseCount={0}
                                    studentCount={0}
                                    action={object.roleInPod === "ROLE_ADMIN" ? ["Manage", "Deactivate"] :
                                        object.roleInPod === "ROLE_TEACHER" ? ["Manage"] : ["View"]}
                                    id={object.id}
                                    key={i}
                                /> */}
                                    <PodCard
                                        pod={object}
                                    />
                                </Col>
                                : null
                        );
                    })}
                </Row>
                {this.state.pendingPods.length > 0 ? <Divider className="mb-5" /> : null}
                {this.state.pods.length > 0 ? <h3>Pods</h3> : null}
                <Row>
                    {this.state.pods.map(function (object, i) {
                        return (
                            object.active ?
                                <Col key={i} xl="4" lg="6">
                                    {/* <PodCard
                                    name={object.podName}
                                    description={object.podDescription}
                                    role={object.roleInPod}
                                    courseCount={0}
                                    studentCount={0}
                                    action={object.roleInPod === "ROLE_ADMIN" ? ["Manage", "Deactivate"] :
                                        object.roleInPod === "ROLE_TEACHER" ? ["Manage"] : ["View"]}
                                    id={object.id}
                                    key={i}
                                /> */}
                                    <PodCard
                                        pod={object}
                                    />
                                </Col>
                                : null
                        );
                    })}
                </Row>
            </ContentWrapper>
        );
    }
}

export default PodManagement;
