import React, { Component } from "react";
import { connect } from "react-redux";
import Task  from "../tasks/Task";

class AddTask extends Component {
  constructor(props) {
    super(props);


    this.state = {
      task: {
        id: "",
        direction: 1,
        participant: 1,
        transport: 1,
        description: "",
        answers: [],
        answer: "",
        imagePreview: "",
        isTyped: false,
        imageFile: null,
        existCorrect: false,
      },
    };
  }

  render() {
    const {user} = this.props.user;
    if(!user.role.name === "teacher")
    {
        this.props.navigate("/tasks");
    }
    return (
      <Task task = {this.state.task} navigate = {this.props.navigate}/>
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

export default connect(mapStateToProps)(AddTask);
