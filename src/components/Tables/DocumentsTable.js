import React, { Component } from 'react';
import {
    Button,
    Table
} from 'reactstrap';
import moment from 'moment';
import Swal from 'sweetalert2';
import FileUploadControl from '../Common/FileUploadControl';
import { getPodDocuments, getPodDocument, createPodDocument, deletePodDocument } from '../../connectors/File';
import { isAdmin } from '../../utils/PermissionChecker';
import '../../styles/app/common/pointer.css';

class DocumentsTable extends Component {

    state = {
        rolePerms: this.props.pod.roleInPod,
        pod: this.props.pod,
        documents: [],
    }

    deleteDocument = (podId, fileName) => {
        Swal.fire({
            title: 'Are you sure you want to delete the document?',
            showCancelButton: true,
            confirmButtonColor: "#5d9cec",
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var stateCopy = this.state;
                var res = deletePodDocument(podId, fileName);
                if (res.isSuccess) {
                    res = getPodDocuments(podId)
                    stateCopy.documents = res.data;
                    this.setState(stateCopy);
                }
                Swal.fire({
                    title: 'Successfully deleted document',
                    icon: 'success',
                    confirmButtonColor: "#5d9cec"
                })
            }
        })
    }

    componentDidMount() {
        var stateCopy = this.state;
        var result = getPodDocuments(this.state.pod.id)
        if (result.isSuccess) {
            stateCopy.documents = result.data;
            this.setState(stateCopy);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.documents !== prevProps.documents) {
            this.setState({ documents: this.props.documents });
        }
    }

    checkFileExists(fileName) {
        return this.state.documents.some(document => document['fileName'] == fileName);
    }

    updateOnDocumentAdd = (res) => {
        if (res.isSuccess) {
            var stateCopy = this.state;
            var result = getPodDocuments(this.state.pod.id)
            if (result.isSuccess) {
                stateCopy.documents = result.data;
                this.setState(stateCopy);
            }
        }
    }

    createDocument = (loadedFile) => {
        var reader = new FileReader();
        reader.readAsDataURL(loadedFile);

        const create = () => {
            var requestBody = {
                "fileInBase64String": reader.result.replace(new RegExp('data:[a-z0-9/;]*base64,'), ""),
                "fileType": loadedFile.type,
                "fileName": loadedFile.name,
            };

            const podDetail = this;
            var result = createPodDocument(podDetail.state.pod.id, JSON.stringify(requestBody));

            if (result.isSuccess) {
                podDetail.updateOnDocumentAdd(result);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to upload document',
                    text: result.message,
                    confirmButtonColor: "#5d9cec"
                })
            }
        }

        reader.addEventListener("load", create);

        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    uploadFile = ({ target: { files } }) => {
        const fileSizeLimit = 10000000; // 10MB limit
        const loadedFile = files[0];

        if (loadedFile.size > fileSizeLimit) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to upload document',
                text: 'File size exceeds limit (10MB)',
                confirmButtonColor: "#5d9cec"
            })
        } else {
            if (this.checkFileExists(loadedFile.name)) {
                Swal.fire({
                    title: 'Are you sure you want to overwrite this file?',
                    showCancelButton: true,
                    confirmButtonColor: "#5d9cec",
                    confirmButtonText: 'Upload',
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.createDocument(loadedFile);
                    }
                })
            } else {
                this.createDocument(loadedFile);
            }
        }
    };

    downloadFile = (fileName, fileType) => {
        var result = getPodDocument(this.state.pod.id, fileName);
        if (result.isSuccess) {
            const fileContentsBase64Decoded = Buffer.from(result.data.base64String, 'base64');
            const link = document.createElement("a");
            const file = new Blob([fileContentsBase64Decoded], { type: fileType });
            link.href = URL.createObjectURL(file);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
        }
    }

    render() {
        var days = ["Sun", "Mon", "Tues", "Wed", "Thrus", "Fri", "Sat"];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return (
            <div>
                {isAdmin(this.state.rolePerms) ?
                    <div className="float-right">
                        <FileUploadControl onChange={this.uploadFile}></FileUploadControl>
                    </div>
                    : null
                }
                <Table hover responsive>
                    {this.state.documents.length > 0 ?
                        this.state.documents.map((document) => {
                            var date = new Date(document.lastModified);
                            return (
                                <tbody>
                                    <tr>
                                        <td className='date'>
                                            <span className="text-uppercase text-bold">
                                                {days[date.getDay()]}
                                                {' '}
                                                {months[date.getMonth()]}
                                                {' '}
                                                {date.getDate()}
                                            </span>
                                            <br />
                                            <span className="h2 mt0 text-sm">
                                                {moment(date).format("h:mm A")}
                                            </span>
                                        </td>
                                        <td className="announcement">
                                            <a className="h4 text-bold pointer" onClick={() => { this.downloadFile(document.fileName, document.mimeType) }}>
                                                {document.fileName}
                                            </a>
                                            <br />
                                            {document.fileSize}
                                        </td>
                                        <td className="buttons">
                                            {isAdmin(this.state.rolePerms) ?
                                                <div className='button-container'>
                                                    <Button className="btn btn-secondary btn-sm bg-danger"
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={() => this.deleteDocument(this.state.pod.id, document.fileName)}>
                                                        <i className="fas fa-trash-alt fa-fw btn-icon"></i>
                                                    </Button>
                                                </div>
                                                : null
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        }
                        )
                        : <tr>
                            <h3 className='text-center pt-5 pb-4'>No Documents</h3>
                        </tr>}
                </Table>
            </div>
        )
    }
}

export default DocumentsTable