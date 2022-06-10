import React, { Component } from 'react';

class Footer extends Component {

    render() {
        return (
            <footer className="footer-container">
                <span>&copy; {new Date().getFullYear()} - Podstruct</span>
            </footer>
        );
    }

}

export default Footer;
