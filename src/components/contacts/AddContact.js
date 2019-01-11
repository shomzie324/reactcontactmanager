import React, { Component } from "react";
import { Consumer } from "../../context";
import TextInputGroup from "../layout/TextInputGroup";
import axios from "axios";

// controlled component: input value always linked to state, so must be changed with an onChange event

class AddContact extends Component {
  state = {
    name: "",
    email: "",
    phone: "",
    errors: {}
  };

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

    const newContact = {
      name,
      email,
      phone
    };

    // call api to add user then call dispatch
    const res = await axios.post(
      "https://jsonplaceholder.typicode.com/users",
      newContact
    );
    dispatch({ type: "ADD_CONTACT", payload: res.data });

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
              <div className='card-header'>Add Contact</div>
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
                    value='Add Contact'
                    className='btn btn-light btn-block'
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

export default AddContact;
