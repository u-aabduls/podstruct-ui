import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../store/actions/actions';
import { withRouter } from 'react-router';
import { logoutUser } from '../../connectors/UserAuth';

import { TabContent, TabPane } from 'reactstrap';


class Offsidebar extends Component {

    state = {
        activeTab: 'settings',
        offsidebarReady: false
    }

    handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);
    
        if (!domNode || !domNode.contains(event.target)) {
            if (this.props.settings.offsidebarOpen) this.toggleOffsidebar();
        }
    }

    toggleOffsidebar = e => {
        this.props.actions.toggleSetting('offsidebarOpen');
    }

    handleSettingCheckbox = event => {
        this.props.actions.changeSetting(event.target.name, event.target.checked);
    }

    handleThemeRadio = event => {
        this.props.actions.changeTheme(event.target.value);
    }

    settingsRedirect = e => {
        this.toggleOffsidebar();
        this.props.history.push('/settings')

    }

    logout = e => {
        if (localStorage.getItem('token')) {
            var res = logoutUser();
            if (res.isSuccess) {
                this.toggleOffsidebar();
                this.props.history.push('/login');
            }
        }
        e.preventDefault()
    }

    componentDidMount() {
        // When mounted display the offsidebar
        this.setState({ offsidebarReady: true });
        document.addEventListener('click', this.handleClickOutside, true);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    render() {
        return (
            this.state.offsidebarReady ?
                <aside className="offsidebar">
                    { /* START Off Sidebar (right) */}
                    <nav>
                        <div>
                            { /* Tab panes */}
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="settings">
                                    <h3 className="text-center text-thin mt-4">Settings</h3>
                                    <div className="clearfix">
                                        <button className="btn btn-block btn-secondary" onClick={this.settingsRedirect}>
                                            <i className="icon-settings fa-pull-left btn-icon"></i>
                                            Manage Profile
                                        </button>
                                    </div>
                                    <div className="clearfix">
                                        <button type="button" className="btn btn-block btn-secondary">
                                            <i className="icon-question float-left btn-icon"></i>
                                            Help
                                        </button>
                                    </div>
                                    <div className="clearfix">
                                        <button type="button" className="btn btn-block btn-secondary" onClick={this.logout}>
                                            <i className="icon-logout fa-pull-left btn-icon"></i>
                                            Sign out
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <h4 className="text-muted text-thin">Themes</h4>
                                        <div className="row row-flush mb-2">
                                            <div className="col-3 mb-3">
                                                <div className="setting-color">
                                                    <label>
                                                        <input type="radio" name="setting-theme" checked={this.props.theme.path === 'themes/theme-a.css'} value='themes/theme-a.css' onChange={this.handleThemeRadio} />
                                                        <span className="icon-check"></span>
                                                        <span className="split">
                                                            <span className="color bg-info"></span>
                                                            <span className="color bg-info-light"></span>
                                                        </span>
                                                        <span className="color bg-white"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-3 mb-3">
                                                <div className="setting-color">
                                                    <label>
                                                        <input type="radio" name="setting-theme" checked={this.props.theme.path === 'themes/theme-b.css'} value='themes/theme-b.css' onChange={this.handleThemeRadio} />
                                                        <span className="icon-check"></span>
                                                        <span className="split">
                                                            <span className="color bg-green"></span>
                                                            <span className="color bg-green-light"></span>
                                                        </span>
                                                        <span className="color bg-white"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-3 mb-3">
                                                <div className="setting-color">
                                                    <label>
                                                        <input type="radio" name="setting-theme" checked={this.props.theme.path === 'themes/theme-c.css'} value='themes/theme-c.css' onChange={this.handleThemeRadio} />
                                                        <span className="icon-check"></span>
                                                        <span className="split">
                                                            <span className="color bg-purple"></span>
                                                            <span className="color bg-purple-light"></span>
                                                        </span>
                                                        <span className="color bg-white"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-3 mb-3">
                                                <div className="setting-color">
                                                    <label>
                                                        <input type="radio" name="setting-theme" checked={this.props.theme.path === 'themes/theme-d.css'} value='themes/theme-d.css' onChange={this.handleThemeRadio} />
                                                        <span className="icon-check"></span>
                                                        <span className="split">
                                                            <span className="color bg-danger"></span>
                                                            <span className="color bg-danger-light"></span>
                                                        </span>
                                                        <span className="color bg-white"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-3 mb-3">
                                                <div className="setting-color">
                                                    <label>
                                                        <input type="radio" name="setting-theme" checked={this.props.theme.path === 'themes/theme-e.css'} value='themes/theme-e.css' onChange={this.handleThemeRadio} />
                                                        <span className="icon-check"></span>
                                                        <span className="split">
                                                            <span className="color bg-info-dark"></span>
                                                            <span className="color bg-info"></span>
                                                        </span>
                                                        <span className="color bg-gray-dark"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-3 mb-3">
                                                <div className="setting-color">
                                                    <label>
                                                        <input type="radio" name="setting-theme" checked={this.props.theme.path === 'themes/theme-f.css'} value='themes/theme-f.css' onChange={this.handleThemeRadio} />
                                                        <span className="icon-check"></span>
                                                        <span className="split">
                                                            <span className="color bg-green-dark"></span>
                                                            <span className="color bg-green"></span>
                                                        </span>
                                                        <span className="color bg-gray-dark"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-3 mb-3">
                                                <div className="setting-color">
                                                    <label>
                                                        <input type="radio" name="setting-theme" checked={this.props.theme.path === 'themes/theme-g.css'} value='themes/theme-g.css' onChange={this.handleThemeRadio} />
                                                        <span className="icon-check"></span>
                                                        <span className="split">
                                                            <span className="color bg-purple-dark"></span>
                                                            <span className="color bg-purple"></span>
                                                        </span>
                                                        <span className="color bg-gray-dark"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-3 mb-3">
                                                <div className="setting-color">
                                                    <label>
                                                        <input type="radio" name="setting-theme" checked={this.props.theme.path === 'themes/theme-h.css'} value='themes/theme-h.css' onChange={this.handleThemeRadio} />
                                                        <span className="icon-check"></span>
                                                        <span className="split">
                                                            <span className="color bg-danger-dark"></span>
                                                            <span className="color bg-danger"></span>
                                                        </span>
                                                        <span className="color bg-gray-dark"></span>
                                                    </label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </TabPane>
                            </TabContent>
                        </div>
                    </nav>
                    { /* END Off Sidebar (right) */}
                </aside>
                : null
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
