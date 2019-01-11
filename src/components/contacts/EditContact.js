import React, { Component } from "react";
import { Consumer } from "../../context";
import TextInputGroup from "../layout/TextInputGroup";
import axios from "axios";

// controlled component: input value always linked to state, so must be changed with an onChange event

class EditContact extends Component {
  state = {
    name: "",
    email: "",
    phone: "",
    errors: {}
  };

  // populate form with contact info after it mounts/renders
  async componentDidMount() {
    const { id } = this.props.match.params;

    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );

    const contact = res.data;

    this.setState({
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    });
  }

  onSubmit = async (dispatch, e) => {
    e.preventDefault();
    const { name, email, phone } = this.state;

    // Error Checking
    if (name === "") {
      this.setState({ errors: { name: "Name is Required" } });
      return;
    }

    if (email === "") {
      this.setState({ errors: { email: "Email is Required" } });
      return;
    }

    if (phone === "") {
      this.setState({ errors: { phone: "Phone is Required" } });
      return;
    }

    // get contact info to update from state
    const updContact = {
      name,
      email,
      phone
    };

    // get id from url params and use for put request along with new info
    const { id } = this.props.match.params;
    const res = await axios.put(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      updContact
    );

    dispatch({ type: "UPDATE_CONTACT", payload: res.data });

    // clear state / form connected to state
    this.setState({
      name: "",
      email: "",
      phone: "",
      errors: {}
    });

    // redirection with react router dom
    this.props.history.push("/");
  };

  // called when anything changes in input
  updateInputVal = e => {
    // make sure input name mataches state property to use generic on change method
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { name, email, phone, errors } = this.state;

    return (
      <Consumer>
        {value => {
          const { dispatch } = value;

          return (
            <div className='card mb-3'>
              <div className='card-header'>Edit Contact</div>
              <div className='card-body'>
                <form onSubmit={this.onSubmit.bind(this, dispatch)}>
                  <TextInputGroup
                    label='Name'
                    name='name'
                    placeholder='Enter Name'
                    value={name}
                    onChange={this.updateInputVal}
                    error={errors.name}
                  />

                  <TextInputGroup
                    label='Email'
                    name='email'
                    type='email'
                    placeholder='Enter Email'
                    value={email}
                    onChange={this.updateInputVal}
                    error={errors.email}
                  />

                  <TextInputGroup
                    label='Phone'
                    name='phone'
                    placeholder='Enter Phone Number'
                    value={phone}
                    onChange={this.updateInputVal}
                    error={errors.phone}
                  />

                  <input
                    type='submit'
                    value='Edit Contact'
                    className='btn btn-warning btn-block'
                  />
                </form>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default EditContact;
