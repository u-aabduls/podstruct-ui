import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../store/actions/actions';
import { withRouter } from 'react-router';
import send from "../../connectors/Logout";

import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

class Offsidebar extends Component {

    state = {
        activeTab: 'settings',
        offsidebarReady: false
    }

    componentDidMount() {
        // When mounted display the offsidebar
        this.setState({ offsidebarReady: true });
    }

    toggle = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    handleSettingCheckbox = event => {
        this.props.actions.changeSetting(event.target.name, event.target.checked);
    }

    handleThemeRadio = event => {
        this.props.actions.changeTheme(event.target.value);
    }

    logout = e => {
        if (localStorage.getItem('token')) {
            var result = send(localStorage.getItem('token'));
            if (result.isSuccess) {
               this.props.history.push('/login');
            }
        }
        e.preventDefault()
    }

    render() {

        return (
            this.state.offsidebarReady &&
            <aside className="offsidebar">
                { /* START Off Sidebar (right) */}
                <nav>
                    <div>
                        { /* Tab panes */} 
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="settings">
                                <h3 className="text-center text-thin mt-4">Settings</h3>
                                    <div className="clearfix">
                                        {/* <p className="float-left">Log out</p> */}
                                        <button type="button" className="btn btn-block btn-secondary float-right" onClick={this.logout}>
                                            Sign out
                                        </button>
                                    </div>
                            </TabPane>
                        </TabContent>
                    </div>
                </nav>
                { /* END Off Sidebar (right) */}
            </aside>
        );
    }

}

Offsidebar.propTypes = {
    actions: PropTypes.object,
    settings: PropTypes.object,
    theme: PropTypes.object
};

const mapStateToProps = state => ({ settings: state.settings, theme: state.theme })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Offsidebar));
