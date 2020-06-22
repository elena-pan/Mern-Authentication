import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { sendPasswordResetLink } from "../../actions/authActions";
import classnames from "classnames";
import validate from "./Validate";

class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
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
        // If logged in and user navigates to page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
    }

    onChangeEmail = e => {
        this.setState({ email: e.target.value });
        const validated = validate({ email: e.target.value });
        this.setState({errors: validated.errors});
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.sendPasswordResetLink(this.state.email, this.props.history); 
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="container">
                <div style={{ marginTop: "4rem", marginBottom:"5rem" }} className="row">
                <div className="col s8 offset-s2">
                    <Link to="/login" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> Back
                    </Link>
                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <h4>
                        <b>Forgot Password</b>
                    </h4>
                    </div>
                    <form noValidate onSubmit={this.onSubmit}>
                    <div className="input-field col s12">
                        <input
                        onBlur={this.onChangeEmail}
                        onChange={this.onChangeEmail}
                        value={this.state.email}
                        error={errors.email}
                        id="email"
                        type="email"
                        className={classnames("", {
                            invalid: errors.email || errors.emailnotfound
                        })}
                        />
                        <label htmlFor="email">Email</label>
                        <span className="red-text">{errors.email || errors.emailnotfound}</span>
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
                        Submit
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
        );
    }
}

ForgotPassword.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { sendPasswordResetLink }
  )(ForgotPassword);