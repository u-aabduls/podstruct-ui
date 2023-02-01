import React, { Component } from 'react';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Row, Col } from 'reactstrap';
import PodSelector from '../../Common/PodSelector';
import CourseCard from './CourseCard';
import { getPods } from '../../../connectors/Pod';
import { getCourses } from '../../../connectors/Course';
import AddCourseForm from '../../Forms/Course/AddCourseForm';
import { isAdmin } from '../../../utils/PermissionChecker';

class CourseManagement extends Component {

    state = {
        selectedPod: '',
        defaultPod: '',
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
            });
        }
    }

    setPod = (pod) => {
        this.setState({ selectedPod: pod });
        var res = getCourses(pod, "")
        if (res.isSuccess) {
            this.setState({
                courses: [...res.data.courses],
                rolePerms: res.data.role,
                defaultPod: ''
            });
        }
    };

    defaultPod = (pod) => {
        var res = getCourses(pod.id, "")
        if (res.isSuccess) {
            this.setState({
                courses: [...res.data.courses],
                rolePerms: res.data.role,
            });
        }
    };

    handleSearchChange = event => {
        this.setState({ subjectFilter: event.target.value });
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
                courses: [...res.data.courses]
            });
        }
    }, 500);

    componentWillMount() {
        var res = getPods('ACCEPTED');
        if (res.isSuccess) {
            this.setState({ pods: res.data });
        }
        if (this.props.history.location.state?.pod) {
            this.setState({ defaultPod: this.props.history.location.state?.pod });
        }
        else if (res.isSuccess) {
            this.setState({ defaultPod: res.data[0] });
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
                    <div>Courses
                        <small>View courses by pod</small>
                    </div>
                    <div className="ml-auto">
                        {isAdmin(this.state.rolePerms) ?
                            <div>
                                <button className="btn btn-success"
                                    onMouseDown={e => e.preventDefault()}
                                    onClick={this.toggleAddCourseModal}>
                                    <em className="fa fa-plus-circle fa-sm button-create-icon"></em> Create Course
                                </button>
                                <AddCourseForm
                                    pods={this.state.pods}
                                    modal={this.state.addCourseModal}
                                    toggle={this.toggleAddCourseModal}
                                    updateOnAdd={this.updateOnCourseAdd}
                                />
                            </div>
                            : null
                        }
                    </div>
                </div>
                <Row>
                    <Col lg="2">
                        <div className="form-group mb-5">
                            <PodSelector
                                name="podSelector"
                                pods={this.state.pods}
                                setPod={(pod) => this.setPod(pod)}
                                defaultCall={(pod) => this.defaultPod(pod)}
                                defaultV={this.state.defaultPod}
                                active="required"
                            />
                        </div>
                    </Col>
                    <Col lg="2">
                        <div className="form-group mb-5">
                            <input
                                className="form-control mb-2"
                                type="text"
                                placeholder="Search courses by subject"
                                value={this.state.subjectFilter}
                                onChange={this.handleSearchChange}
                            />
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
                            <h1>{this.state.fake}</h1>
                        </div>
                    }
                </div>
            </ContentWrapper>
        );
    }

}

export default CourseManagement;