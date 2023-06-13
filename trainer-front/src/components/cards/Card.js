import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { connect } from "react-redux";
import ImageService from "../../services/image.service";
import { ShowForRoles } from "../permission/ShowRolesComponent";
import { BlockWithoutRoles } from "../permission/BlockRolesComponent";
import { DropdownList } from "react-widgets";
import { SET_MESSAGE } from "../../actions/types";
import { addImage, getImage, updateImage } from "../../actions/image";
import { createCard, updateCard } from "../../actions/card";
import cardsService from "../../services/cards.service";
import Textarea from "react-validation/build/textarea";


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



class Task extends Component {
  constructor(props) {
    super(props);
    this.handleAdded = this.handleAdded.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    this.onChangeLink = this.onChangeLink.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.setUp = this.setUp.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
    this.updateCard = this.updateCard.bind(this);

    let card = this.props.card === undefined ?? null;
    this.state = this.setUp(card);
  }

  setUp(card) {
    return {
      id: card.id ?? "",
      description: card.description ?? "",
      imagePreview: card.image
        ? `data:image/png;base64,${card.image.imageData}`
        : "",
      imageFile: card.image ?? "",
      newFile: card.image ?? "",
      link: card.link ?? "",
      loading: false,
    };
  }

  componentDidMount() {
    if (!this.props.card) {
      cardsService.getById(this.props.params.id).then(
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
        existCorrect: false
      });
    }
    this.state.answers.splice(id, 1);
    this.setState({});
  }

  handleAdded(e) {
    e.preventDefault();
    this.setState({
      loading: true,
    });
    if (!this.validateImage()) {
      return;
    }

    this.form.validateAll();

    const { dispatch } = this.props;
    if (this.checkBtn.context._errors.length === 0) {
      dispatch(addImage(this.state.newFile))
        .then((response) => {
          this.addNewCard(response.data);
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

  addNewCard(image) {
    this.props
      .dispatch(
        createCard({
          description: this.state.description,
          link: this.state.link,
          image: image,
        })
      )
      .then(() => {
        this.props.navigate("/cards", { replace: true });
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

  handleUpdate(e) {
    e.preventDefault();
    this.setState({
      loading: true,
    });
    this.form.validateAll();
    const { dispatch } = this.props;
    if (this.checkBtn.context._errors.length === 0) {
      if (this.state.newFile === this.state.imageFile) {
        dispatch(getImage(this.state.imageFile.id))
          .then((response) => {
            this.updateCard(response.data);
          })
          .catch(() => {
            this.setState({
              loading: false,
            });
          });
      } else {
        dispatch(updateImage(this.state.newFile, this.state.imageFile.id))
          .then((response) => {
            this.updateCard(response.data);
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

  updateCard(image) {
    const { dispatch } = this.props;
    dispatch(
      updateCard({
        id: this.state.id,
        description: this.state.description,
        link: this.state.link,
        image: image,
      })
    )
      .then(() => {
        this.props.navigate("/cards", { replace: true });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
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

    return (
      <div className="col-md-12">
        <BlockWithoutRoles permission="teacher">
          <div className="card bg-light text-dark">
            <h1>
              <center>Добавление карточки </center>
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
                <label htmlFor="description">Ссылка: </label>
                <Input
                  type="link"
                  className="form-control"
                  name="link"
                  value={this.state.link}
                  onChange={this.onChangeLink}
                  validations={[required]}
                />
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
