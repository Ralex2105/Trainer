import React, { Component } from "react";
import { connect } from "react-redux";
import TasksService from "../../services/tasks.service";
import EventBus from "../../common/EventBus";
import { ShowForRoles } from "../permission/ShowRolesComponent";
import testsService from "../../services/test.service";
import Input from "react-widgets/cjs/Input";

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.chooseAnswer = this.chooseAnswer.bind(this);
    this.onEditAnswer = this.onEditAnswer.bind(this);
    this.state = {
      loading: false,
    };
  }

  handleReload() {
    window.location.reload(false);
  }

  handleDelete(e) {
    testsService.deleteTaskForTest(e.id).then(() => {
      TasksService.deleteById(e.id).then(
        (response) => {
          this.handleReload();
        },
        (error) => {
          this.setState({
            tasks:
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
    });
  }

  chooseAnswer(element, id) {
    this.props.test.tasks[id].answer = element;
    this.props.userAnswers[id] = element;
    this.setState({});
  }

  onEditAnswer(e, id) {
    this.props.test.tasks[id].answer = {answer: e.target.value};
    this.props.userAnswers[id] = {answer: e.target.value};
    this.setState({});
  }

  render() {
    const { test } = this.props;
    let tasks;
    if (test) {
      tasks = test.tasks.map((testTasks) => testTasks.task);
    } else {
      tasks = this.props.tasks;
    }
    if (tasks) {
      const items = tasks.map((task, i) => (
        <div className="card bg-light text-dark w-75" key={task.id}>
          <ul className="d-flex justify-content-center">
            <img
              className="w-75"
              alt={task.image.name}
              src={`data:image/png;base64,${task.image.imageData}`}
            />
          </ul>
          <div key={task.id}>
            {!test && (
              <div className="d-flex my-3">
                <strong>Ссылка: </strong>
                <a href={task.link} className="mx-2">
                  {task.link}
                </a>
              </div>
            )}
            <p>
              <strong>Направление: </strong> {task.direction.name}
            </p>
            <p>
              <strong>Участник ВЭД: </strong> {task.participant.name}
            </p>
            <p>
              <strong>Транспорт: </strong> {task.transport.name}
            </p>
            <p>
              <strong>Описание: </strong>
              {task.description}
            </p>
            <p>
              {!test && this.props.userAnswers ? (
                !this.props.userAnswers[i] ||
                !this.props.userAnswers[i].correct ? (
                  <strong className="text-danger">Ваш ответ неверный</strong>
                ) : (
                  <strong className="text-success">Ваш ответ верный</strong>
                )
              ) : (
                ""
              )}
            </p>
            {!task.typed ? (
              <div>
                <p>
                  <strong>Ответы: </strong>{" "}
                </p>
                <div className="list-group">
                  {task.answers.map((answer) => {
                    let answerLabel = "list-group-item ";
                    if (
                      this.props.userAnswers &&
                      this.props.userAnswers[i] &&
                      answer.id === this.props.userAnswers[i].id
                    ) {
                      answerLabel +=
                        test || answer.correct
                          ? "list-group-item-success"
                          : "list-group-item-danger";
                    } else {
                      answerLabel +=
                        !test && answer.correct
                          ? "list-group-item-success"
                          : "";
                    }
                    return (
                      <p
                        onClick={() => test && this.chooseAnswer(answer, i)}
                        key={answer.id}
                        className={answerLabel}
                      >
                        {answer.answer}
                      </p>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="answer">Ответ: </label>
                <input
                  disabled={!test}
                  type="text"
                  className="form-control"
                  name="answer"
                  key={!test ? task.answers[0].id: 0}
                  value={!test ? task.answers[0].answer:  this.props.userAnswers[i]&& this.props.userAnswers[i].answer}
                  onChange={(value) => test && this.onEditAnswer(value, i)}
                />
              </div>
            )}
          </div>
          <hr></hr>
          <div className="d-flex justify-content-between">
            <ShowForRoles permission="teacher">
              <button
                type="button"
                className="btn btn-success"
                disabled={this.state.loading}
                onClick={() => this.props.navigate("/tasks/" + task.id)}
              >
                <i className="bi bi-pen" style={{ fontSize: 16 }}></i>
                &nbsp;Изменить
              </button>
            </ShowForRoles>
            <ShowForRoles permission="teacher">
              <button
                type="button"
                className="btn btn-danger"
                disabled={this.state.loading}
                onClick={() => this.handleDelete(task)}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <i className="bi bi-trash" style={{ fontSize: 16 }}></i>
                &nbsp;Удалить
              </button>
            </ShowForRoles>
          </div>
        </div>
      ));
      return <ul>{items}</ul>;
    }
  }
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { isTestExists } = state.test;
  return {
    isLoggedIn,
    isTestExists,
  };
}

export default connect(mapStateToProps)(TaskList);
