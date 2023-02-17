import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';

class ErrorBoundary extends Component {

    state = {
        hasError: false
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true
        }
    }

    resetError = () => {
        this.setState({
            hasError: false
        })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="abs-center wd-xl mt-5">
                    <div className="text-center mb-4">
                        <div className="mb-3">
                            <em className="fa fa-wrench fa-5x text-muted"></em>
                        </div>
                        <div className="text-lg mb-3">Rendering Error</div>
                        <p className="lead m-0">Oops! Something went wrong rendering the page.</p>
                        <p>Don't worry, we're now checking this.</p>
                        <p>If this error persists, please email us with detail about the issue.</p>
                    </div>
                    <ul className="list-inline text-center text-sm mb-4">
                        <li className="list-inline-item">
                            <Link to="/dashboard" className="text-muted" onClick={this.resetError}>Go to Dashboard</Link>
                        </li>
                        <li className="text-muted list-inline-item">|</li>
                        <li className="list-inline-item">
                            <Link to="/login" className="text-muted" onClick={this.resetError}>Login</Link>
                        </li>
                        <li className="text-muted list-inline-item">|</li>
                        <li className="list-inline-item">
                            <Link to="/register" className="text-muted" onClick={this.resetError}>Register</Link>
                        </li>
                    </ul>
                    <div className="p-3 text-center">
                        <span className="mr-2">&copy;</span>
                        <span>{new Date().getFullYear()}</span>
                        <span className="mx-2">-</span>
                        <span>Podstruct</span>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}

export default withRouter(ErrorBoundary)