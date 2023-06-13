import React, { Component } from "react";
import { connect } from "react-redux";
import Card from "./Card";

class AddCard extends Component {
  constructor(props) {
    super(props);


    this.state = {
      card: {
        id: "",
        category: 1,
        description: "",
        link: "",
        imagePreview: "",
        imageFile: null,
        existCorrect: false,
      },
    };
  }

  render() {
    const {user} = this.props.user;
    if(!user.role.name === "teacher")
    {
        this.props.navigate("/cards");
    }
    return (
      <Card card = {this.state.card} navigate = {this.props.navigate}/>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn, user } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message,
    user,
  };
}

export default connect(mapStateToProps)(AddCard);
