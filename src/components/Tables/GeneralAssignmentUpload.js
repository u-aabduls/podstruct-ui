import React, { Component } from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Table
} from 'reactstrap';
import moment from 'moment';
import Swal from 'sweetalert2';
import FileUploadControl from '../Common/FileUploadControl';
import {
    getDocumentSubmissions,
    getDocumentSubmission,
    createDocumentSubmission,
    deleteDocumentSubmission,
} from '../../connectors/Submission';
import { isStudent } from '../../utils/PermissionChecker';
import '../../styles/app/common/pointer.css';
import { swalConfirm } from '../../utils/Styles';

class GeneralAssignmentUpload extends Component {

    state = {
        role: this.props.role,
        assignment: this.props.assignment,
        podId: this.props.podId,
        courseId: this.props.courseId,
        documents: [],
    }

    getDocuments = () => {
        var result = getDocumentSubmissions(this.state.podId, this.state.courseId, this.state.assignment.id);

        result.data?.sort(function (a, b) {
            return (a.lastModified).localeCompare(b.lastModified);
        }).reverse();

        return result;
    }

    getDocument = (fileName) => {
        return getDocumentSubmission(this.state.podId, this.state.courseId, this.state.assignment.id, fileName);
    }

    deleteDocument = (fileName) => {
        Swal.fire({
            title: 'Delete \'' + fileName + '\'?',
            text: 'Access to this document will be removed for all users in this ' + this.state.parentType,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: swalConfirm(),
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var stateCopy = this.state;

                var res = deleteDocumentSubmission(this.state.podId, this.state.courseId, this.state.assignment.id, fileName);
                if (res.isSuccess) {
                    res = this.getDocuments();
                    stateCopy.documents = res.data;
                    this.setState(stateCopy);
                }
                Swal.fire({
                    title: 'Successfully deleted document',
                    icon: 'success',
                    confirmButtonColor: swalConfirm()
                })
            }
        })
    }

    componentDidMount() {
        var stateCopy = this.state;
        var result = this.getDocuments();
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
        return this.state.documents.some(document => document['fileName'] === fileName);
    }

    updateOnDocumentAdd = (res) => {
        if (res.isSuccess) {
            var stateCopy = this.state;
            var result = this.getDocuments();
            if (result.isSuccess) {
                stateCopy.documents = result.data;
                this.setState(stateCopy);
            }
        }
    }

    toggleFileUploadButton = () => {
        var fileUploadButton = document.getElementById('fileUploadButton'),
            dummyFileUploadButton = document.getElementById('dummyFileUploadButton');
        if (dummyFileUploadButton.classList.contains("hidden")) {
            fileUploadButton.classList.add("hidden");
            dummyFileUploadButton.classList.remove("hidden");
        } else {
            dummyFileUploadButton.classList.add("hidden");
            fileUploadButton.classList.remove("hidden");
        }
    }

    getFileType = (fileType, fileName) => {
        if (fileType !== '') {
            return fileType;
        } else {
            if (fileName.includes(".rar")) {
                return "application/vnd.rar";
            } else {
                return '';
            }
        }
    }

    createDocument = (loadedFile) => {
        this.toggleFileUploadButton();

        var reader = new FileReader();
        reader.readAsDataURL(loadedFile);
        const create = () => {
            var requestBody = {
                "fileInBase64String": reader.result.replace(new RegExp('data:[a-z0-9/.;+-]*base64,'), ""),
                "fileType": this.getFileType(loadedFile.type, loadedFile.name),
                "fileName": loadedFile.name,
            };

            const o = this;

            var result = createDocumentSubmission(o.state.podId, o.state.courseId, o.state.assignment.id, JSON.stringify(requestBody));

            this.toggleFileUploadButton();
            if (result.isSuccess) {
                o.updateOnDocumentAdd(result);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to upload document',
                    text: result.message,
                    confirmButtonColor: swalConfirm()
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
                confirmButtonColor: swalConfirm()
            })
        } else {
            if (this.checkFileExists(loadedFile.name)) {
                Swal.fire({
                    title: 'Replace \'' + loadedFile.name + '\'?',
                    icon: 'warning',
                    text: 'Replacing it will overwrite the existing file',
                    showCancelButton: true,
                    confirmButtonColor: swalConfirm(),
                    confirmButtonText: 'Replace',
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
        var result = this.getDocument(fileName);
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

    shouldHideBorderTop = (row) => {
        return !isStudent(this.state.role) && row === 0 ? { borderTop: 'none' } : null;
    }

    render() {
        var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return (
            <div>
                {isStudent(this.state.role) && !this.props.passedDue ?
                    <div className="float-right">
                        <FileUploadControl onChange={this.uploadFile}></FileUploadControl>
                    </div>
                    : null
                }
                <Card outline color="dark" className="mt-5 card-default card-fixed-height-assignment" style={{ clear: 'both' }}>
                    <CardHeader><CardTitle tag="h3">Instructions</CardTitle></CardHeader>
                    <CardBody style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                        <p className="ml-3 text-primary font-weight-bold">{this.props.assignment.instructions}</p>
                    </CardBody>
                </Card>
                <Table hover responsive>
                    {this.state.documents.length > 0 ?
                        this.state.documents.map((document, i) => {
                            var date = new Date(document.lastModified);
                            return (
                                <tr>
                                    <td className="date" style={this.shouldHideBorderTop(i)}>
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
                                    <td className="document" style={this.shouldHideBorderTop(i)}>
                                        <a
                                            href="/#"
                                            className="h4 text-bold pointer"
                                            onClick={() => { this.downloadFile(document.fileName, document.mimeType) }}
                                        >
                                            {document.fileName}
                                        </a>
                                        <br />
                                        {document.fileSize}
                                    </td>
                                    <td className="buttons" style={this.shouldHideBorderTop(i)}>
                                        {isStudent(this.state.role) && !this.props.passedDue ?
                                            <div className='button-container'>
                                                <Button
                                                    className="btn btn-secondary btn-sm bg-danger float-right"
                                                    onMouseDown={e => e.preventDefault()}
                                                    onClick={() => this.deleteDocument(document.fileName)}
                                                >
                                                    <i className="fas fa-trash-alt fa-fw btn-icon"></i>
                                                </Button>
                                            </div>
                                            : null
                                        }
                                    </td>
                                </tr>
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

export default GeneralAssignmentUpload