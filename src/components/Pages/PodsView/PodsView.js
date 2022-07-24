import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Row, Col, Card, CardHeader, CardBody, CardFooter, Table, Progress } from 'reactstrap';
import Sparkline from '../../Common/Sparklines';
import getPods from "../../../connectors/PodsRetrieval";
import PodsViewCard from './PodsViewCard';
import { Link } from 'react-router-dom';

class PodView extends Component {

    state = {
        pods: []
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
            roleInPod: "ROLE_STUDENT"
        })
        result.push({
            podName: "O Dummy Pod",
            podDescription: "Dummy description",
            roleInPod: "ROLE_TEACHER"
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
                        <small>Manage and create pods</small>
                    </div>
                    <div>
                        <Link to="/pod/create" className="btn btn-success mr-5" title="Create Pod">
                            <em className="fa fa-plus-circle fa-sm" style={this.buttonLabelStyle}></em> Create Pod
                        </Link>
                    </div>
                </div>
                <Row>
                    {this.state.pods.map(function (object, i) {
                        return (
                            <Col xl="4" lg="6">
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
                            </Col>
                        );
                    })}
                </Row>
            </ContentWrapper>
        );
    }

}

export default PodView;
