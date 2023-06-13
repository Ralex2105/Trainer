import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";
import { connect } from "react-redux";
import TaskService from "../../services/tasks.service";
import ImageService from "../../services/image.service";
import { ShowForRoles } from "../permission/ShowRolesComponent";
import { BlockWithoutRoles } from "../permission/BlockRolesComponent";
import { SET_MESSAGE } from "../../actions/types";
import { createTask, updateTask } from "../../actions/task";
import { addImage, getImage, updateImage } from "../../actions/image";
import CategoryList from "../category/CategoryList";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Это поле обязательно!
      </div>
    );
  }
};

const descriptionValidator = (value) => {
  if (value.length < 5 || value.length > 250) {
    return (
      <div className="alert alert-danger" role="alert">
        Описание должно быть от 5 до 250 символов.
      </div>
    );
  }
};

const answerValidator = (value) => {
  if (value.length < 5 || value.length > 250) {
    return (
      <div className="alert alert-danger" role="alert">
        Ответ должен быть от 5 до 250 символов.
      </div>
    );
  }
};

class Task extends Component {
  constructor(props) {
    super(props);
    this.handleAdded = this.handleAdded.bind(this);
    this.onChangeDirection = this.onChangeDirection.bind(this);
    this.onChangeParticipant = this.onChangeParticipant.bind(this);
    this.onChangeTransport = this.onChangeTransport.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    this.onChangeAnswer = this.onChangeAnswer.bind(this);
    this.onChangeItem = this.onChangeItem.bind(this);
    this.onChangeLink = this.onChangeLink.bind(this);
    this.onChangeTyped = this.onChangeTyped.bind(this);
    this.handleAddAnswer = this.handleAddAnswer.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.onChangeCorrect = this.onChangeCorrect.bind(this);
    this.setUp = this.setUp.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.updateTask = this.updateTask.bind(this);

    let task = this.props.task === undefined ?? null;
    this.state = this.setUp(task);
  }

  setUp(task) {
    console.log(task.typed ? task.answers[0] : task.answers);
    return {
      id: task.id ?? "",
      direction: task.direction ?? 1,
      participant: task.participant ?? 4,
      transport: task.transport ?? 7,
      description: task.description ?? "",
      answers: task.answers ?? [],
      answer: task.typed ? task.answers[0] : { answer: "", correct: true },
      imagePreview: task.image
        ? `data:image/png;base64,${task.image.imageData}`
        : "",
      imageFile: task.image ?? "",
      typed: task.typed ?? false,
      newFile: task.image ?? "",
      link: task.link ?? "",
      loading: false,
      existCorrect: task.id ? task.id !== "" : false,
    };
  }

  componentDidMount() {
    if (!this.props.task) {
      TaskService.getById(this.props.params.id).then(
        (response) => {
          let task = response.data;
          this.setState(this.setUp(task));
        },
        (error) => {
          this.props.navigate("/tasks", { replace: true });
        }
      );
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleDelete(id) {
    if (this.state.answers[id].correct) {
      this.setState({
        existCorrect: false,
      });
    }
    this.state.answers.splice(id, 1);
    this.setState({});
  }

  handleAddAnswer(e) {
    e.preventDefault();
    this.state.answers.push({
      answer: this.state.answer.answer,
      correct: false,
    });
    this.setState({});
  }

  handleAdded(e) {
    e.preventDefault();
    this.setState({
      loading: true,
    });
    if (!this.validateAnswers() || !this.validateImage()) {
      return;
    }

    this.form.validateAll();
    const { dispatch } = this.props;
    if (this.checkBtn.context._errors.length === 0) {
      dispatch(addImage(this.state.newFile))
        .then((response) => {
          this.addNewTask(response.data);
        })
        .catch(() => {
          console.log("ups");
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

  addNewTask(image) {
    this.props
      .dispatch(
        createTask({
          direction: this.state.direction,
          participant: this.state.participant,
          transport: this.state.transport,
          description: this.state.description,
          link: this.state.link,
          image: image,
          typed: this.state.typed,
          answers: this.state.typed ? [this.state.answer] : this.state.answers,
        })
      )
      .then(() => {
        this.props.navigate("/tasks", { replace: true });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
        ImageService.deleteById(image.id);
      });
  }

  validateImage() {
    const { dispatch } = this.props;
    if (this.state.newFile === "") {
      dispatch({
        type: SET_MESSAGE,
        payload: "Изображение должно быть добавлено",
      });
      this.setState({
        loading: false,
      });
      return false;
    }

    return true;
  }

  validateAnswers() {
    const { dispatch } = this.props;
    if (this.state.typed) {
      if (this.state.answer == "") {
        this.setState({
          loading: false,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: "Ответ должен быть введен",
        });

        return false;
      }
    } else if (this.state.answers.length < 2) {
      this.setState({
        loading: false,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: "Ответов должно быть хотя бы 2",
      });

      return false;
    } else if (
      this.state.answers.filter((answer) => answer.correct).length !== 1
    ) {
      this.setState({
        loading: false,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: "Нет правильного ответа",
      });

      return false;
    }

    return true;
  }

  handleUpdate(e) {
    e.preventDefault();
    this.setState({
      loading: true,
    });

    if (!this.validateAnswers()) {
      return;
    }
    this.form.validateAll();
    const { dispatch } = this.props;
    if (this.checkBtn.context._errors.length === 0) {
      if (this.state.newFile === this.state.imageFile) {
        dispatch(getImage(this.state.imageFile.id))
          .then((response) => {
            this.updateTask(response.data);
          })
          .catch(() => {
            this.setState({
              loading: false,
            });
          });
      } else {
        dispatch(updateImage(this.state.newFile, this.state.imageFile.id))
          .then((response) => {
            this.updateTask(response.data);
          })
          .catch(() => {
            this.setState({
              loading: false,
            });
          });
      }
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  updateTask(image) {
    const { dispatch } = this.props;
    dispatch(
      updateTask({
        id: this.state.id,
        direction: this.state.direction,
        participant: this.state.participant,
        transport: this.state.transport,
        description: this.state.description,
        image: image,
        link: this.state.link,
        typed: this.state.typed,
        answers: this.state.typed ? [this.state.answer] : this.state.answers,
      })
    )
      .then(() => {
        this.props.navigate("/tasks", { replace: true });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  }

  onChangeItem(e) {
    this.setState((state) => {
      state.answers[e.target.id].answer = e.target.value;
    });
  }

  onChangeCorrect(e) {
    if (!this.state.existCorrect || this.state.answers[e.target.id].correct) {
      this.state.answers[e.target.id].correct =
        !this.state.answers[e.target.id].correct;
      this.state.existCorrect = this.state.answers[e.target.id].correct;
      this.setState({});
    }
  }

  onChangeAnswer(e) {
    this.state.answer.answer = e.target.value;
    this.setState({});
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

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }

  onChangeLink(e) {
    this.setState({
      link: e.target.value,
    });
  }

  onChangeTyped() {
    this.setState({
      typed: !this.state.typed,
    });
  }

  onChangeImage(e) {
    if (e.target.files[0]) {
      this.setState({
        newFile: e.target.files[0],
        imagePreview: URL.createObjectURL(e.target.files[0]),
      });
    }
  }

  render() {
    const { isLoggedIn, message, isTestExists } = this.props;

    if (!isLoggedIn) {
      return <Navigate to="/" />;
    }
    if (isTestExists) {
      return <Navigate to="/test" />;
    }
    let listItems;

    if (this.state) {
      listItems = this.state.answers.map((answer, i) => (
        <div className="row gx-2 my-2" key={i}>
          <div className="col">
            <Input
              type="text"
              className="form-control"
              name="answer"
              id={i}
              value={answer.answer}
              onChange={this.onChangeItem}
              validations={[required, answerValidator]}
            />
          </div>

          <div className="col">
            <input
              className="mx-3"
              type="checkbox"
              id={i}
              onChange={this.onChangeCorrect}
              checked={answer.correct}
            />
            <ShowForRoles permission="teacher">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => this.handleDelete(i)}
              >
                <i className="bi bi-trash" style={{ fontSize: 16 }}></i>
              </button>
            </ShowForRoles>
          </div>
        </div>
      ));
    }
    return (
      <div className="col-md-12">
        <BlockWithoutRoles permission="teacher">
          <div className="card bg-light text-dark">
            <h1>
              <center>
                {!this.state.id ? "Добавление задания" : "Задание"}
              </center>
            </h1>

            <Form
              onSubmit={!this.state.id ? this.handleAdded : this.handleUpdate}
              ref={(c) => {
                this.form = c;
              }}
            >
              <img
                className="rounded mx-auto d-block w-50"
                alt={this.state.newFile.name}
                id="image"
                src={this.state.imagePreview}
              ></img>
              <hr></hr>
              <h4>Изображение</h4>
              <Input type="file" onChange={this.onChangeImage}></Input>
              <div className="form-group">
                <label htmlFor="direction">Направление: </label>
                <CategoryList
                  onChange={this.onChangeDirection}
                  category={this.state.direction}
                  type="Direction"
                />
              </div>

              <div className="form-group">
                <label htmlFor="participant">Участник ВЭД: </label>
                <CategoryList
                  onChange={this.onChangeParticipant}
                  category={this.state.participant}
                  type="Participant"
                />
              </div>

              <div className="form-group">
                <label htmlFor="transport">Транспорт: </label>
                <CategoryList
                  onChange={this.onChangeTransport}
                  category={this.state.transport}
                  type="Transport"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Описание: </label>
                <Textarea
                  className="form-control small-12 medium-12 columns"
                  name="description"
                  value={this.state.description}
                  rows="14"
                  onChange={this.onChangeDescription}
                  validations={[required, descriptionValidator]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Ссылка на карточку: </label>
                <Input
                  type="link"
                  className="form-control"
                  name="link"
                  value={this.state.link}
                  onChange={this.onChangeLink}
                  validations={[required]}
                />
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="typed"
                  id="typedCheckBox"
                  checked={this.state.typed}
                  onChange={this.onChangeTyped}
                />
                <label className="form-check-label" htmlFor="typedCheckBox">
                  Рукописное задание
                </label>
              </div>

              <div className="form-group">
                <ShowForRoles permission="teacher">
                  <label htmlFor="answer">Ответ: </label>
                  <div className="d-flex">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        name="answer"
                        value={this.state.answer.answer}
                        onChange={this.onChangeAnswer}
                      />
                    </div>
                    {!this.state.typed && (
                      <div className="col-lg-2 my-auto">
                        <button
                          className="btn btn-dark btn-block "
                          disabled={this.state.loading}
                          onClick={this.handleAddAnswer}
                        >
                          {this.state.loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                          )}
                          <span>Добавить ответ</span>
                        </button>
                      </div>
                    )}
                  </div>
                </ShowForRoles>
                {!this.state.typed && <label htmlFor="answers">Ответы:</label>}
                {!this.state.typed && listItems}
              </div>

              <ShowForRoles permission="teacher">
                <div className="form-group">
                  <button
                    className="btn btn-dark btn-block"
                    disabled={this.state.loading}
                  >
                    {this.state.loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    {!this.state.id ? (
                      <span>Добавить</span>
                    ) : (
                      <span>Сохранить</span>
                    )}
                  </button>
                </div>

                {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                )}
              </ShowForRoles>
              <CheckButton
                style={{ display: "none" }}
                ref={(c) => {
                  this.checkBtn = c;
                }}
              />
            </Form>
          </div>
        </BlockWithoutRoles>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { message } = state.message;
  const { isTestExists } = state.test;

  return {
    isLoggedIn,
    message,
    isTestExists,
  };
}

export default connect(mapStateToProps)(Task);
