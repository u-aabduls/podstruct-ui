import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Card, CardHeader, Table } from 'reactstrap';

class PodCard extends Component {

    state = {
        pod: ''
    }

    componentDidMount() {
        this.setState({ pod: this.props.pod })
    }

    componentDidUpdate(prevProps) {
        if (this.props.pod !== prevProps.pod) {
            this.setState({ pod: this.props.pod })
        }
    }

    render() {
        return (
            <div className='course-preview'>
                <Link to={{ pathname: `/pod/details/${this.state.pod.id}`, state: {pod: this.state.pod, from: 'Pod Management'}}}>
                    <Card outline color="dark" className="b">
                        <CardHeader className="theme-card-header">
                            <h4 className="m-0 text-center">{this.state.pod.podName}</h4>
                        </CardHeader>
                        <Table>
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>My Role:</strong>
                                    </td>
                                    <td>
                                        {this.state.pod.roleInPod}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card >
                </Link>
            </div>
        )
    }
}

export default withRouter(PodCard);