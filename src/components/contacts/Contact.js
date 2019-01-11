import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Consumer } from "../../context";
import axios from "axios";

class Contact extends Component {
  // Another way to declare prop types for type checking
  // static propTypes = {
  //   name: PropTypes.string.isRequired,
  //   email: PropTypes.string.isRequired,
  //   phone: PropTypes.string.isRequired
  // };

  state = {
    showContactInfo: false
  };

  // if anything other than the event object is being used, function must be bound:
  // onClick={this.toggleDetails.bind(this, 1)
  toggleDetails = () => {
    this.setState({
      ...this.state,
      showContactInfo: !this.state.showContactInfo
    });
  };

  // reducer in context will change state based on action object properties
  // example dispatch call: dispatch({ type: "DELETE_CONTACT", payload: id });
  onDeleteClick = async (id, dispatch) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
    dispatch({ type: "DELETE_CONTACT", payload: id });
  };

  render() {
    const { id, name, email, phone } = this.props.contact;
    return (
      <Consumer>
        {value => {
          const { dispatch } = value;
          return (
            <div className='card card-body mb-3'>
              <h4>
                {name}{" "}
                <i
                  onClick={this.toggleDetails}
                  style={{ cursor: "pointer" }}
                  className='fas fa-sort-down'
                />
                <i
                  className='fas fa-times'
                  style={{ cursor: "pointer", float: "right", color: "red" }}
                  onClick={this.onDeleteClick.bind(this, id, dispatch)}
                />
                <Link to={`contact/edit/${id}`}>
                  <i
                    style={{
                      cursor: "pointer",
                      float: "right",
                      color: "black",
                      marginRight: "1rem"
                    }}
                    className='fas fa-pencil-alt'
                  />
                </Link>
              </h4>
              {this.state.showContactInfo ? (
                <ul className='list-group'>
                  <li className='list-group-item'>Email: {email}</li>
                  <li className='list-group-item'>Phone Number: {phone}</li>
                </ul>
              ) : null}
            </div>
          );
        }}
      </Consumer>
    );
  }
}

Contact.propTypes = {
  contact: PropTypes.object.isRequired
};

// default means curly braces not needed when importing
export default Contact;
