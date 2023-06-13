import React, { Component } from "react";

import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import DropdownList from "react-widgets/DropdownList";
import { NumberPicker } from "react-widgets";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { generateTest } from "../../actions/test";
import CategoryList from "../category/CategoryList";

class GeneratorTest extends Component {
  constructor(props) {
    super(props);
    this.onChangeDirection = this.onChangeDirection.bind(this);
    this.onChangeParticipant = this.onChangeParticipant.bind(this);
    this.onChangeTransport = this.onChangeTransport.bind(this);
    this.onChangeNumOfTask = this.onChangeNumOfTask.bind(this);
    this.generateTest = this.generateTest.bind(this);
    this.state = {
      direction: 1,
      participant: 4,
      transport: 8,
      numOfTask: 5,
      loading: false,
    };
  }

  onChangeDirection(value) {
    this.setState({
      direction: value,
    });
  }

  onChangeParticipant(value) {
    this.setState({
      participant: value,
    });
  }
  onChangeTransport(value) {
    this.setState({
      transport: value,
    });
  }
  onChangeNumOfTask(value) {
    this.setState({
      numOfTask: value,
    });
  }

  generateTest(e) {
    e.preventDefault();

    this.setState({
      loading: true,
    });

    const { dispatch, navigate } = this.props;

    if (this.checkBtn.context._errors.length === 0) {
      dispatch(
        generateTest(
          this.state.numOfTask,
          this.state.direction.id ?? this.state.direction,
          this.state.participant.id ?? this.state.participant,
          this.state.transport.id ?? this.state.transport
        )
      )
        .then(() => {
          navigate("/test", { replace: true });
        })
        .catch(() => {
          this.setState({
            loading: false,
          });
        });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { isLoggedIn, message } = this.props;
    if (!isLoggedIn && !this.state.test) {
      return <Navigate to="/" />;
    }
    if (this.state.test) {
      return <Navigate to="/test" />;
    }
    return (
      <div className="card bg-light text-dark">
        <Form
          onSubmit={this.generateTest}
          ref={(c) => {
            this.form = c;
          }}
        >
          <div className="form-group">
            <label>Направление: </label>
            <CategoryList
              onChange={this.onChangeDirection}
              category={this.state.direction}
              type="Direction"
            />
          </div>
          <div className="form-group">
            <label>Участник ВЭД: </label>
            <CategoryList
              onChange={this.onChangeParticipant}
              category={this.state.participant}
              type="Participant"
            />
          </div>
          <div className="form-group">
            <label>Транспорт: </label>
            <CategoryList
              onChange={this.onChangeTransport}
              category={this.state.transport}
              type="Transport"
            />
          </div>
          <div className="form-group">
            <label>Количество заданий: </label>
            <NumberPicker
              defaultValue={5}
              max={20}
              min={1}
              onChange={(value) => this.onChangeNumOfTask(value)}
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn-success btn-block"
              disabled={this.state.loading}
            >
              {this.state.loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Сгенерировать тест</span>
            </button>
          </div>
          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton
            style={{ display: "none" }}
            ref={(c) => {
              this.checkBtn = c;
            }}
          />
        </Form>
      </div>
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

export default connect(mapStateToProps)(GeneratorTest);
