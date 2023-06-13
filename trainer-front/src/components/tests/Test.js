import React, { Component } from "react";

import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import TaskList from "../tasks/TaskList";
import { setMessage } from "../../actions/message";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import EventBus from "../../common/EventBus";
import testsService from "../../services/test.service";
import { CLEAR_MESSAGE } from "../../actions/types";
import { getNonCompleteTestForUser } from "../../actions/test";
class Test extends Component {
  constructor(props) {
    super(props);
    this.checkTest = this.checkTest.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.state = {
      loading: false,
    };
  }

  handleCancel() {
    testsService.cancelTest(this.state.test.id).then(
      (response) => {
        window.location.reload(false);
      },
      (error) => {
        this.setState({
          error:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(getNonCompleteTestForUser(this.props.user.user.id)).then(
      (response) => {
        this.setState({
          test: response.data,
        });
      },
      (error) => {
        this.props.navigate("/test/generate");
      }
    );
  }

  checkTest(e) {
    e.preventDefault();
    this.setState({
      loading: true,
    });
    const { dispatch, navigate } = this.props;
    let isFail = false;
    this.state.test.tasks.forEach((testTasks) => {
      console.log(testTasks.answer);
      if (testTasks.answer == null) {
        dispatch(setMessage("Вы не ответили на все задания"));
        isFail = true;
        return;
      }
    });

    if (!isFail) {
      testsService
        .completeTest(this.state.test)
        .then(() => {
          navigate("/profile", { replace: true });
          window.location.reload(false);
          dispatch({
            type: CLEAR_MESSAGE,
          });
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
    if (!isLoggedIn) {
      return <Navigate to="/" />;
    }
    return (
      <div className="card bg-light text-dark">
        {this.state.test && (
          <Form
            onSubmit={this.checkTest}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <TaskList
                test={this.state.test}
                userAnswers={this.state.test.tasks.map((task) => task.answer)}
                navigate={this.props.navigate}
              />
            </div>
            <div className="form-group d-flex ">
              <button
                className="btn btn-success btn-block m-2"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <strong>Сдать тест</strong>
              </button>
              <button
                className="btn btn-danger btn-block m-2 "
                disabled={this.state.loading}
                onClick={() => this.handleCancel()}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <strong>Отменить тест</strong>
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
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn, user } = state.auth;
  const { message } = state.message;
  return {
    user,
    isLoggedIn,
    message,
  };
}

export default connect(mapStateToProps)(Test);
