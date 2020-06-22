import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { checkPasswordToken, resetPassword } from "../../actions/authActions";
import classnames from "classnames";
import validate from "./Validate";

class ResetPassword extends Component {
    constructor() {
        super();
        this.passwordInput = React.createRef();
        this.password2Input = React.createRef();
        this.state = {
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.errors !== prevProps.errors && this.props.errors) {
          this.setState({
            errors: this.props.errors
          });
        }
    }

    componentDidMount() {
        this.props.checkPasswordToken(this.props.match.params.token);
    }

    onChangePassword = e => {
        this.setState({ password:this.passwordInput.current.value, password2: this.password2Input.current.value });
        const validated = validate({ password: this.passwordInput.current.value, password2: this.password2Input.current.value });
        let prevErrorState = {...this.state.errors};
        prevErrorState.password = validated.errors.password;
        prevErrorState.password2 = validated.errors.password2;
        this.setState({errors: prevErrorState});
    }

    onSubmit = e => {
        e.preventDefault();
        const userData = {
            password: this.state.password,
            password2: this.state.password2
        };
        this.props.resetPassword(this.props.match.params.token, userData, this.props.history); 
    };

    render() {
        const { errors } = this.state;
        const { valid, loading } = this.props.passwordToken;
        let content;
        if (valid) {
            content = (
                <>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <h4>
                    <b>Reset Password</b>
                </h4>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                    <input
                    ref={this.passwordInput}
                    onBlur={this.onChangePassword}
                    onChange={this.onChangePassword}
                    value={this.state.password}
                    error={errors.password}
                    id="password"
                    type="password"
                    className={classnames("", {
                        invalid: errors.password
                    })}
                    />
                    <label htmlFor="password">New Password</label>
                    <span className="red-text">{errors.password}</span>
                </div>
                <div className="input-field col s12">
                    <input
                    ref={this.password2Input}
                    onBlur={this.onChangePassword}
                    onChange={this.onChangePassword}
                    value={this.state.password2}
                    error={errors.password2}
                    id="password2"
                    type="password"
                    className={classnames("", {
                        invalid: errors.password2
                    })}
                    />
                    <label htmlFor="password2">Confirm New Password</label>
                    <span className="red-text">{errors.password2}</span>
                </div>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <button
                    style={{
                        width: "150px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem"
                    }}
                    type="submit"
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                    >
                    Change Password
                    </button>
                </div>
                </form>
                </>
            )
        }
        else if (errors.tokennotfound || errors.usernotfound) {
            content = (<div className="grey-text center"><h5 style={{lineHeight:"170%", marginTop:"5rem"}}><b>This link is invalid or expired.</b></h5></div>)
        }
        else if (loading) {
            content = (<div></div>);
        }
        return (
            <div className="container">
                <div style={{ marginTop: "4rem", marginBottom:"5rem", minHeight:"75vh" }} className="row">
                <div className="col s8 offset-s2">
                    { content }
                </div>
                </div>
            </div>
        );
    }
}

ResetPassword.propTypes = {
    passwordToken: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    passwordToken: state.passwordToken,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { checkPasswordToken, resetPassword }
  )(ResetPassword);