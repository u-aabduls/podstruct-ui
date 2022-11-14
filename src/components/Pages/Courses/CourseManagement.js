import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Button, Input, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import PodSelector from '../../Common/PodSelector';
import CourseCard from './CourseCard';
import { getPods } from '../../../connectors/Pod';
import { getCourses } from '../../../connectors/Course';
import AddCourseForm from '../../Forms/Course/AddCourseForm';
import { isAdmin } from '../../../utils/PermissionChecker';

class CourseManagement extends Component {

    state = {
        selectedPod: '',
        subjectFilter: '',
        pods: [],
        courses: [],
        addCourseModal: false,
        rolePerms: '',
    }

    toggleAddCourseModal = () => {
        this.setState({
            addCourseModal: !this.state.addCourseModal
        });
    }

    updateOnCourseAdd = (res, pod) => {
        if (res.isSuccess) {
            this.setState({
                selectedPod: pod,
                courses: res.data.courses
            })
        }
    }

    setPod = (pod) => {
        this.setState({ selectedPod: pod });
        var res = getCourses(pod, "")
        if (res.isSuccess) {
            this.setState({
                courses: [...res.data.courses],
                rolePerms: res.data.role
            })
        }
    };

    handleSearchChange = event => {
        this.setState({ subjectFilter: event.target.value })
    }

    debounce = (fn, delay) => {
        let timerId;
        return (...args) => {
            clearTimeout(timerId);
            timerId = setTimeout(fn, delay, [...args]);
        };
    };

    filterRequest = this.debounce(() => {
        var res = getCourses(this.state.selectedPod, this.state.subjectFilter)
        if (res.isSuccess) {
            this.setState({
                courses: [...res.data]
            })
        }
    }, 500);

    componentDidMount() {
        var res = getPods()
        if (res.isSuccess) {
            this.setState({ pods: res.data })
            this.setState({ test: "test" })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.subjectFilter !== this.state.subjectFilter) {
            if (this.state.courses) {
                this.setState({ courses: [] });
            }
            this.filterRequest();
        }
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Course Management
                        <small>Click on a card to be redirected to a more detailed course page</small>
                    </div>

                    <div className="ml-auto">
                        {isAdmin(this.state.rolePerms) ?
                            <button className="btn btn-success"
                                onClick={this.toggleAddCourseModal}>
                                <em className="fa fa-plus-circle fa-sm button-create-icon"></em> Create Course
                            </button>
                            : null
                        }
                        <AddCourseForm
                            pods={this.state.pods}
                            modal={this.state.addCourseModal}
                            toggle={this.toggleAddCourseModal}
                            updateOnAdd={this.updateOnCourseAdd}
                        />
                    </div>
                </div>

                <Row>
                    <Col lg="2">
                        <div className="form-group mb-5">
                            <PodSelector
                                name="podSelector"
                                pods={this.state.pods}
                                setPod={(pod) => this.setPod(pod)}
                                defaultv={this.state.selectedPod}
                                active="required"
                            />
                        </div>
                    </Col>
                    <Col lg="2">
                        <div className="form-group mb-5">
                            <input className="form-control mb-2" type="text" placeholder="Search courses by subject" value={this.state.subjectFilter} onChange={this.handleSearchChange} />
                        </div>
                    </Col>
                </Row>

                <div className="row">
                    {this.state.courses.length ?
                        this.state.courses.map(function (course) {
                            return (
                                course.active &&
                                <Col xl="4" lg="6">
                                    <CourseCard
                                        course={course}
                                    />
                                </Col>
                            )
                        }) :
                        <div className='not-found'>
                            <h1>No courses found</h1>
                        </div>
                    }
                </div>
            </ContentWrapper>
        );
    }

}



export default CourseManagement;