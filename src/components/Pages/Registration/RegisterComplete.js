import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class RegisterComplete extends Component {

    render() {
        return (
            <div className="block-center mt-4 wd-xl">
                {/* START card */}
                <div className="card card-flat">
                    <div className="card-header text-center bg-primary">
                        <a href="/#">
                            <img className="block-center" src="img/logos/favicon.png" alt="Logo" />
                            <img className="block-center" style={{ marginLeft: '0.25rem' }} src="img/logos/podstruct_text.svg" alt="Logo" />
                        </a>
                    </div>
                    <div className="card-body">
                        <p className="text-center py-2">ACCOUNT CREATED</p>
                        <form>
                            <p className="text-left">Your account has been created. Once your email has been verified, you will be able to login to your account.</p>
                            <Link to="/login" className="btn btn-block btn-primary">Continue to login</Link>
                        </form>
                    </div>
                </div>
                {/* END card */}
                <div className="p-3 text-center">
                    <span className="mr-2">&copy;</span>
                    <span>{new Date().getFullYear()}</span>
                    <span className="mx-2">-</span>
                    <span>Podstruct</span>
                </div>
            </div>
        );
    }
}

export default RegisterComplete;