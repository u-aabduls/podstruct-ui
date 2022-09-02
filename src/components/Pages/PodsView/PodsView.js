import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Row, Col, Input } from 'reactstrap';
import { getPods } from "../../../connectors/Pod";
import PodsViewCard from './PodsViewCard';
import Swal from '../../Common/Swal';
import renderSwal from '../../Common/Modal/PodCreation';

class PodView extends Component {

    state = {
        pods: [],
        podCreate: {
            name: '',
            description: '',
            phone: '',
            address: ''
        }
    }

    buttonLabelStyle = {
        marginRight: `0.3rem`
    }

    contentHeadingStyle = {
        marginBottom: `1rem`,
        justifyContent: `space-between`
    }

    componentDidMount() {
        var result = getPods().payload;
        result.push({
            podName: "H Dummy Pod",
            podDescription: "Dummy description",
            roleInPod: "ROLE_STUDENT",
            active: true
        })
        result.push({
            podName: "O Dummy Pod",
            podDescription: "Dummy description",
            roleInPod: "ROLE_TEACHER",
            active: true
        })
        result.sort(function (a, b) {
            return (a.podName).localeCompare(b.podName);
        })
        this.setState({ pods: result });
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
                            onClick={() => { renderSwal() }}>
                            <em className="fa fa-plus-circle fa-sm" style={this.buttonLabelStyle}></em> Create Pod
                        </button>
                    </div>
                </div>
                <Row>
                    {this.state.pods.map(function (object, i) {
                        return (
                            object.active ?
                                <Col key={i} xl="4" lg="6">
                                    <PodsViewCard
                                        name={object.podName}
                                        description={object.podDescription}
                                        role={object.roleInPod}
                                        courseCount={0}
                                        studentCount={0}
                                        action={object.roleInPod === "ROLE_ADMIN" ? ["Manage", "Deactivate"] :
                                            object.roleInPod === "ROLE_TEACHER" ? ["Manage"] : ["View"]}
                                        id={object.id}
                                        key={i}
                                        isOddRow={i % 2 != 0}
                                    />
                                </Col> : null
                        );
                    })}
                </Row>
            </ContentWrapper>
        );
    }
}

export default PodView;
