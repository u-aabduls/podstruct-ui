import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import { withRouter } from "react-router-dom";
import { denyInvite, acceptInvite } from '../../../connectors/PodUserInvite';
import Swal from 'sweetalert2';

class InvitedPodForm extends Component {

    state = {
        pod: this.props.pod,
        modal: this.props.modal,
    }

    toggleModal = () => {
        this.setState({
            modal: false
        })
    }

    deny = () => {
        var res = denyInvite(this.state.pod.id)
        if (res.isSuccess){
            this.toggleModal()
            Swal.fire({
                title: "Denied pod invite",
                icon: "success",
            })
            this.props.history.push('/pods')
        }
        else {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: res.message
            })
        }
    }

    accept = () => {
        var res = acceptInvite(this.state.pod.id)
        if (res.isSuccess){
            this.toggleModal()
            Swal.fire({
                title: "Accepted pod invite",
                icon: "success",
            })
            window.location.reload(false);
        }
        else {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: res.message
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.modal !== prevProps.modal) {
            this.setState({ modal: this.props.modal })
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.modal}>
                    <ModalHeader>Invited to {this.state.pod.podName}</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <h4>You have been invited to join <u>{this.state.pod.podName}</u>. Do you want to accept the invite?</h4>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.deny}>Deny</Button>
                        <Button color="primary" onClick={this.accept}>Accept</Button>
                    </ModalFooter>
            </Modal>
        )
    }
}

export default withRouter(InvitedPodForm)