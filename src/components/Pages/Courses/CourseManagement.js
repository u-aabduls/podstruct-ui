import React, { Component } from 'react';
import { connect } from 'react-redux';
import ContentWrapper from '../../Layout/ContentWrapper';
import { Button, Row, Col,} from 'reactstrap';
import Select from 'react-select';
import CourseCard from './CourseCard';
import renderSwal from '../../Modal/CourseCreation';
import { getPods, getCourses, addCourse } from '../../../connectors/Course';
import * as actions from '../../../store/actions/actions';
import { bindActionCreators } from 'redux';
import FormValidator from '../../Forms/FormValidator';

class CourseManagement extends Component {

    state = {
        formAddCourse: {
            subject: '',
            daysOfWeekInterval: '',
            startTime: '',
            endTime: '',
            number: '',
            teacher: '',
            description: '',
            selectedPod: ''
        },
        selectedPod: '',
        subjectFilter: '',
        pods: [],
        courses: [],
    }

    options = []

    daysOfWeek = ["Mon", "Tues", "Wed", "Thrus", "Fri", "Sat", "Sun"]

    colourStyles = {
        placeholder: (provided) => ({
            ...provided,
            color: "#b7bac9",
        })
    }

    /**
     * Validate input using onChange event
     * @param  {String} formName The name of the form in the state object
     * @return {Function} a function used for the event
     */
    validateOnChange = event => {
        const input = event.target;
        const form = input.form
        const value = input.type === 'checkbox' ? input.checked : input.value;

        const result = FormValidator.validate(input);

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                [input.name]: value,
                errors: {
                    ...this.state[form.name].errors,
                    [input.name]: result
                }
            }
        });
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return this.state[formName] &&
            this.state[formName].errors &&
            this.state[formName].errors[inputName] &&
            this.state[formName].errors[inputName][method]
    }

    constructRequestPayload = () => {
        return JSON.stringify({
            "subject": this.state.formAddCourse.subject,
            "daysOfWeekInterval": this.state.formAddCourse.daysOfWeekInterval,
            "startTime": this.state.formAddCourse.startTime,
            "endTime": this.state.formAddCourse.endTime,
            "description": this.state.formAddCourse.description,
            "number": this.state.formAddCourse.number,
            "teacher": this.state.formAddCourse.teacher,
        })
    }

    debounce = (fn, delay) => {
        let timerId;
        return (...args) => {
            clearTimeout(timerId);
            timerId = setTimeout(fn, delay, [...args]);
        };
    };

    setOptions() {
        this.options = this.state.pods.map(function (pod) {
            return { value: pod.id, label: pod.podName }
        })
    }

    setPod = (pod) => {
        this.setState({ selectedPod: pod });
        this.props.actions.changeLoaderState('loading', true);
        getCourses(pod, "").then(res => {
            if (res.isSuccess) {
                this.setState({
                    courses: [...res.data]
                })
            }
        }).finally(() => {
            this.props.actions.changeLoaderState('loading', false);
        })
    };

    handleSearchChange = event => {
        this.setState({ subjectFilter: event.target.value })
    }

    filterRequest = this.debounce(() => {
        this.props.actions.changeLoaderState('loading', true);
        getCourses(this.state.selectedPod, this.state.subjectFilter).then(res => {
            if (res.isSuccess) {
                this.setState({
                    courses: [...res.data]
                })
            }

        }).finally(() => {
            this.props.actions.changeLoaderState('loading', false);
        })

    }, 500);

    componentDidMount() {
        this.props.actions.changeLoaderState('loading', true);
        getPods().then(res => {
            if (res.isSuccess) {
                this.setState({
                    pods: [...res.data]
                })
            }
        }).finally(() => {
            this.props.actions.changeLoaderState('loading', false);
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.subjectFilter !== this.state.subjectFilter) {
            if (this.state.courses) {
                this.setState({ courses: [] });
            }
            this.filterRequest();
        }
    }

    onSubmit = e => {

        const form = e.target;

        const inputsToValidate = [
            'subject',
            'number',
            'teacher',
            'description',
        ];

        const inputs = [...form.elements].filter(i => inputsToValidate.includes(i.name))

        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                errors
            }
        });

        const invalidDOB = this.validateDateOfBirth();

        console.log((hasError || invalidDOB) ? 'Form has errors. Check!' : 'Form Submitted!')

        if (!hasError && !invalidDOB) {
            var result = addCourse(this.state.selectedPod, this.constructRequestPayload());
            this.displayToast(
                result.message,
                result.isSuccess ? "success" : "error",
                "bottom-center"
            );
        }

        e.preventDefault();
    }

    render() {
        this.setOptions()
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Course Management
                        <small>Click on a card to be redirected to a more detailed course page</small>
                    </div>

                    <div className="ml-auto">
                        <Button className="btn btn-secondary btn-sm" onClick={event => renderSwal(event, this.state.pods)}>Add Course</Button>
                    </div>
                </div>

                <Row>
                    <Col lg="2">
                        <div className="form-group mb-5">
                            <Select
                                name="podSelector"
                                multi
                                simpleValue
                                placeholder="Select a Pod..."
                                styles={this.colourStyles}
                                value={this.options.find(o => o.value === this.state.selectedPod)}
                                onChange={(e) => { this.setPod(e.value) }}
                                options={this.options}
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
                                <Col xl="4" lg="6">
                                    <CourseCard
                                        subject={course.subject}
                                        id={course.id}
                                        description={course.description}
                                        daysOfWeekInterval={course.daysOfWeekInterval}
                                        startTime={course.startTime}
                                        endTime={course.endTime}
                                    />
                                </Col>
                            )
                        }) :
                        <div className='not-found'>
                            <h1>No courses found</h1>
                        </div>}

                </div>
            </ContentWrapper>
        );
    }

}

const mapStateToProps = state => ({ loader: state.loader })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(CourseManagement);