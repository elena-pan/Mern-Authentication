import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class PasswordResetLinkSent extends Component {
    
    componentDidMount() {
        // If logged in and user navigates to page, redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.replace("/dashboard");
        }
    }

    render() {
        return (
            <div className="row">
                <div style={{ marginTop: "7rem", marginBottom:"5rem", minHeight:"75vh" }} className="col s6 offset-s3 center grey-text">
                <h5 style={{lineHeight:"170%"}}>
                    <b>A password reset link has been sent to your email. The link will expire in 1 hour.</b>
                    </h5>
                </div>
            </div>
        );
    }
}

PasswordResetLinkSent.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PasswordResetLinkSent);