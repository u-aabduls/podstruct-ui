import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Row, Col, Card, CardHeader, CardFooter, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import send from "../../../connectors/PodsRetrieval";
import PodsViewRow from './PodsViewRow';

import Sparkline from '../../Common/Sparklines.js';

class PodView extends Component {

    state = {
        pods: []
    }

    componentDidMount() {
        var result = send().payload;
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
                {/* START card */}
                <Card className="card-default">
                    {/* <CardHeader>Demo Table #1</CardHeader> */}
                    {/* START table-responsive */}
                    <Table bordered hover responsive>
                        <thead class="thead-light">
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
