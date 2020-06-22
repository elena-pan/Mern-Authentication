import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { connect } from "react-redux";

class Toasts extends Component {
  createToast = (message, type) => {
    const options = {
      hideProgressBar: true,
      transition: Slide,
    };
    const messageHTML = (<div style={{marginLeft: "1rem"}}>{ message }</div>);
    switch (type) {
      case 'info':
        toast.info(messageHTML, options);
        break;
      case 'success':
        toast.success(messageHTML, options);
        break;
      case 'warning':
        toast.warning(messageHTML, options);
        break;
      case 'error':
        toast.error(messageHTML, options);
        break;
      default:
        const messageHTMLBlack = (<div className="black-text" style={{marginLeft: "1rem"}}>{ message }</div>)
        toast(messageHTMLBlack, options);

    }
  };

  componentDidMount = () => {
    if (this.props.toasts.message) {
        const { message, type } = this.props.toasts
        this.createToast(message, type);
    }
  }

  componentDidUpdate = prevProps => {
    if (prevProps.toasts !== this.props.toasts && this.props.toasts) {
      const { type, message } = this.props.toasts
      this.createToast(message, type);
    }
  }
 
  render() {
    return (
      <div>
        <ToastContainer style={{width:"20rem", marginTop:"5rem"}} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
    toasts: state.toasts
});

export default connect(mapStateToProps)(Toasts);
