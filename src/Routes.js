import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

/* loader component for Suspense*/
import PageLoader from './components/Common/PageLoader';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';
// import BaseHorizontal from './components/Layout/BaseHorizontal';

/* Used to render a lazy component with react-router */
const waitFor = Tag => props => <Tag {...props} />;

const Register = lazy(() => import('./components/Pages/Registration/Register'));
const RegisterComplete = lazy(() => import('./components/Pages/Registration/RegisterComplete'));
const Login = lazy(() => import('./components/Pages/Login'));
const NotFound = lazy(() => import('./components/Pages/NotFound'));
const PasswordRecover = lazy(() => import('./components/Pages/PasswordRecovery/PasswordRecover'));
const PasswordReset = lazy(() => import('./components/Pages/PasswordRecovery/PasswordReset'));

const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const Settings = lazy(() => import('./components/Extras/Settings'));

const PodLanding = lazy(() => import('./components/Pages/Pods/PodLanding'));
const PodDetail = lazy(() => import('./components/Pages/Pods/PodDetail'));
const CourseLanding = lazy(() => import('./components/Pages/Courses/CourseLanding'));
const CourseDetail = lazy(() => import('./components/Pages/Courses/CourseDetail'));
const AssignmentDetail =  lazy(() => import('./components/Pages/Courses/Assignments/AssignmentDetail'));

// List of routes that uses the page layout
// listed here to Switch between layouts
// depending on the current pathname
const listofPages = [
    '/register/account',
    '/register/complete',
    '/login',
    '/notfound',
    '/password/recover',
    '/password/reset',
];

const Routes = ({ location }) => {
    const currentKey = location.pathname.split('/')[1] || '/';
    const timeout = { enter: 500, exit: 500 };

    // Animations supported
    //      'rag-fadeIn'
    //      'rag-fadeInRight'
    //      'rag-fadeInLeft'

    const animationName = 'rag-fadeIn'

    if (listofPages.indexOf(location.pathname) > -1) {
        return (
            // Page Layout component wrapper
            <BasePage>
                <Suspense fallback={<PageLoader />}>
                    <Switch location={location}>
                        {/* See full project for reference */}
                        <Route path="/register/account" component={waitFor(Register)} />
                        <Route path="/register/complete" component={waitFor(RegisterComplete)} />
                        <Route path="/login" component={waitFor(Login)} />
                        <Route path="/notfound" component={waitFor(NotFound)} />
                        <Route path="/password/recover" component={waitFor(PasswordRecover)} />
                        <Route path="/password/reset" component={waitFor(PasswordReset)} />
                    </Switch>
                </Suspense>
            </BasePage>
        )
    }
    else {
        return (
            // Layout component wrapper
            // Use <BaseHorizontal> to change layout
            <Base>
                <TransitionGroup>
                    <CSSTransition key={currentKey} timeout={timeout} classNames={animationName} exit={false}>
                        <div>
                            <Suspense fallback={<PageLoader />}>
                                <Switch location={location}>
                                    {/*Dashboard*/}
                                    <Route path="/dashboard" component={waitFor(Dashboard)} />

                                    {/*Extras*/}
                                    <Route path="/settings" component={waitFor(Settings)} />
                                    
                                    <Route path="/pods" component={waitFor(PodLanding)} />
                                    <Route path="/pod/details/:id" component={waitFor(PodDetail)} />
                                    <Route path="/courses" component={waitFor(CourseLanding)} />
                                    <Route path="/course/details/:podId/:courseId" component={waitFor(CourseDetail)} />
                                    <Route path="/course/assignment/details/:podId/:courseId/:assignmentId" component={waitFor(AssignmentDetail)} />

                                    {/*Default*/}
                                    <Redirect to="/dashboard" />
                                </Switch>
                            </Suspense>
                        </div>
                    </CSSTransition>
                </TransitionGroup>
            </Base>
        )
    }
}

export default withRouter(Routes);
