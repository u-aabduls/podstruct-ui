import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Row, Col, Card, CardHeader, CardFooter, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { getPods } from '../../../connectors/Pod';
import PodsViewRow from './PodsViewRow';
import { Link } from 'react-router-dom';

class PodView extends Component {

    state = {
        pods: []
    }

    buttonLabelStyle = {
        marginRight: `5px`
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
        result.sort(function(a,b){
            return (a.podName).localeCompare(b.podName);
        })
        this.setState({pods: result});
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Pods
                        <small>Manage and create pods</small>
                    </div>
                </div>
                <div className="mb-3 text-right">
                    <Link to="/pod/create" className="btn btn-success mr-5" title="Create Pod">
                        <em className="fa fa-plus-circle fa-sm" style={this.buttonLabelStyle}></em> Create Pod
                    </Link>
                </div>
                {/* START card */}
                <Card className="card-default">
                    {/* <CardHeader>Demo Table #1</CardHeader> */}
                    {/* START table-responsive */}
                    <Table bordered hover responsive>
                        <thead className="thead-dark">
                            <tr>
                                <th>Pod Name</th>
                                <th>Pod Description</th>
                                <th>Role</th>
                                <th>Number of courses</th>
                                <th>Number of students</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.pods.map(function(object, i){
                                return <PodsViewRow
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
                                        />;
                            })}
                        </tbody>
                    </Table>
                </Card>
            </ContentWrapper>
            );
    }

}

export default PodView;
