import React, { Component } from "react";
import axios from "axios";

// Step 1: create context and reducer

const Context = React.createContext();

// reducers process actions to change state
const reducer = (state, action) => {
  switch (action.type) {
    case "DELETE_CONTACT":
      return {
        // spread operator represents the rest of the object or array
        ...state,
        contacts: state.contacts.filter(
          contact => contact.id !== action.payload
        )
      };
    case "ADD_CONTACT":
      return {
        ...state,
        contacts: [action.payload, ...state.contacts]
      };
    case "UPDATE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id
            ? (contact = action.payload)
            : contact
        )
      };
    default:
      return state;
  }
};

// Step 2: export Provider tag with state
// and Context.Provider component
export class Provider extends Component {
  state = {
    contacts: [],
    // components will call dispatch to change state
    dispatch: action => {
      this.setState(state => reducer(state, action));
    }
  };

  // this lifecycle method best place for http requests
  // axios needs to be installed but is easier to use than fetch api
  async componentDidMount() {
    const res = await axios.get("https://jsonplaceholder.typicode.com/users");
    this.setState({ contacts: res.data });
  }

  // on the render, return context provider with value set to anything that should be available in the entire app
  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

// Step 3: export Consumer tag

export const Consumer = Context.Consumer;
