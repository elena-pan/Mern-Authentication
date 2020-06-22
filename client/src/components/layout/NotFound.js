import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class NotFound extends Component {
  render() {
    return (
        <div style={{ minHeight: "75vh" }} className="container">
            <h2 className="grey-text center" style={{marginTop:"10rem"}}>
                404 Not Found <br/>
                <h4>Return to <Link to="/">home</Link></h4>
            </h2>
        </div>
    );
  }
}

NotFound.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(NotFound);