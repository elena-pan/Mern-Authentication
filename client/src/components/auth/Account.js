import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateUser, deleteUser } from "../../actions/authActions";
import classnames from "classnames";
import validate from "./Validate";

class Account extends Component {
    constructor() {
        super();
        this.submitNameBtn = React.createRef();
        this.submitPasswordBtn = React.createRef();
        this.passwordInput = React.createRef();
        this.passwordInput2 = React.createRef();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidMount = () => {
        this.setState({ name: this.props.auth.user.name });
        this.setState({ email: this.props.auth.user.email });
    }

    componentDidUpdate = prevProps => {
        if (prevProps.auth.user !== this.props.auth.user) {
            this.setState({ name: this.props.auth.user.name, password: "", password2: "", errors: {} });
            this.submitNameBtn.current.setAttribute("disabled", "true");
            this.submitPasswordBtn.current.setAttribute("disabled", "true");

        }
    }

    onChangeName = e => {
        this.setState({ name: e.target.value });
        const validated = validate({ name: e.target.value });
        let prevErrorState = {...this.state.errors};
        prevErrorState.name = validated.errors.name;
        this.setState({errors: prevErrorState});
        if (prevErrorState.name || e.target.value === this.props.auth.user.name) {
            this.submitNameBtn.current.setAttribute("disabled", "true");
        }
        else {
            this.submitNameBtn.current.removeAttribute("disabled");
        }
    }

    onChangePassword = e => {
        this.setState({ password: this.passwordInput.current.value });
        this.setState({ password2: this.passwordInput2.current.value });

        const validated = validate({ password: this.passwordInput.current.value, password2: this.passwordInput2.current.value });
        let prevErrorState = {...this.state.errors};
        prevErrorState.password = validated.errors.password;
        prevErrorState.password2 = validated.errors.password2;
        this.setState({ errors: prevErrorState });
        if (prevErrorState.password || prevErrorState.password2) {
            this.submitPasswordBtn.current.setAttribute("disabled", "true");
        }
        else {
            this.submitPasswordBtn.current.removeAttribute("disabled");
        }
    }

    onSubmitName = e => {
        e.preventDefault();
        this.props.updateUser({ name: this.state.name });
    }
    onSubmitPassword = e => {
        e.preventDefault()
        this.props.updateUser({ password: this.state.password });
    }
    onDeleteAccountClick = e => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            this.props.deleteUser(this.props.history);
        }
    }

    render() {
        const { errors } = this.state;
        return (
            <div style={{ marginTop:"3rem", marginBottom:"5rem" }} className="container">
                <div className="row">
                <div className="col s8 offset-s2">
                    <div className="col s12" style={{ paddingLeft: "11.250px", paddingBottom:"2rem" }}>
                        <h4>
                            <b>My Account</b>
                        </h4>
                    </div>
                    <div className="col s12" style={{ paddingBottom:"0.5rem" }}>
                        <h5>
                            <b>Basics</b>
                        </h5>
                    </div>
                    <form noValidate onSubmit={this.onSubmitName}>
                        <div className="input-field col s12">
                            <input
                            onChange={this.onChangeName}
                            value={this.state.name}
                            error={errors.name}
                            id="name"
                            type="text"
                            className={classnames("", {
                                invalid: errors.name
                            })}
                            />
                            <label className="active" htmlFor="name">Name</label>
                            <span className="red-text">
                                {errors.name}
                            </span>
                        </div>
                        <div className="input-field col s12">
                            <input
                            disabled
                            value={ this.state.email }
                            />
                            <label className="active" htmlFor="email">Email</label>
                        </div>
                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                            <button
                            ref={this.submitNameBtn}
                            disabled
                            style={{
                                width: "220px",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem"
                            }}
                            type="submit"
                            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                            >
                            Save Changes
                            </button>
                        </div>
                    </form>
                    <div className="col s12" style={{marginTop:"3rem"}}></div>
                    <div className="col s12" style={{ paddingBottom:"0.5rem" }}>
                        <h5>
                            <b>Password</b>
                        </h5>
                    </div>       
                    <form noValidate onSubmit={this.onSubmitPassword}>
                        <div className="input-field col s12">
                            <input
                            ref={this.passwordInput}
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
                            <span className="red-text">
                                {errors.password}
                            </span>
                        </div>
                        <div className="input-field col s12">
                        <input
                            ref={this.passwordInput2}
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
                            <span className="red-text">
                                {errors.password2}
                            </span>
                        </div>
                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                            <button
                            ref={this.submitPasswordBtn}
                            disabled
                            style={{
                                width: "220px",
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
                    <div className="col s12" style={{marginTop:"3rem"}}></div>
                    <div className="col s12" style={{ paddingBottom:"0.5rem" }}>
                        <h5>
                            <b>Delete Account</b>
                        </h5>
                    </div>
                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                            <button
                            style={{
                                width: "220px",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem"
                            }}
                            onClick={this.onDeleteAccountClick}
                            className="btn btn-large waves-effect waves-light hoverable red accent-3"
                            >
                            Delete Account
                            </button>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

Account.propTypes = {
    updateUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { updateUser, deleteUser }
)(Account);