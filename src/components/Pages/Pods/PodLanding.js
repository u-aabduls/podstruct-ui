import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Row, Col } from 'reactstrap';
import { getPods } from "../../../connectors/Pod";
import PodCard from './PodCard';
import { Divider } from '@material-ui/core';
import AddPodForm from '../../Forms/Pod/AddPodForm';

class PodLanding extends Component {

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
                <div className="content-heading" style={{ marginBottom: `1rem`, justifyContent: `space-between` }}>
                    <div>
                        Pods
                        <small>Create and view pods</small>
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

export default PodLanding;