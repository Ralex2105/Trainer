import React, { Component } from "react";
import "../../css/Map.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup, useControl } from "react-map-gl";
import MarkerService from "../../services/markers.service";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import Modal from "react-modal";
import Form from "react-validation/build/form";
import Textarea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { createMarker, updateMarker } from "../../actions/marker";
import eventBus from "../../common/EventBus";
import Input from "react-validation/build/input";
import CategoryList from "../category/CategoryList";

const REACT_APP_MAPBOX_TOKEN =
  "pk.eyJ1IjoibXJzaG9pY2hpIiwiYSI6ImNsaHl4eHdweTBhaTgzZ3Jza2ZzejdpOW8ifQ.9AfIqFFcGXGgReydGk0gIw";

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

const nameValidator = (value) => {
  if (value.length < 5 || value.length > 250) {
    return (
      <div className="alert alert-danger" role="alert">
        Название должно быть от 5 до 250 символов.
      </div>
    );
  }
};

const CustomPopup = ({ index, marker, closePopup }) => {
  return (
    <Popup
      latitude={marker.lat}
      longitude={marker.lon}
      onClose={closePopup}
      closeButton={true}
      closeOnClick={false}
      offsetTop={-30}
      className="container-fluid"
    >
      <div className="container-fluid md-3">
        <h2 className="my-3">{marker.name}</h2>
        <p>
          Транспорт: <span>{marker.transport.name}</span>
        </p>

        <p>Описание: {marker.description}</p>
        <a className="btn btn-danger " href="http://localhost:3000/test">
          Сгенерировать тест
        </a>
      </div>
    </Popup>
  );
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const CustomMarker = ({ index, marker, openPopup, changeMarker }) => {
  return (
    <Marker longitude={marker.lon} latitude={marker.lat}>
      <div
        className="marker"
        onClick={() => openPopup(index)}
        onDoubleClick={() => changeMarker(marker)}
      >
        <span>
          <i className="bi bi-geo-alt-fill fs-1 text-danger"></i>
        </span>
      </div>
    </Marker>
  );
};

function DrawControl() {
  useControl(
    () =>
      new MapboxLanguage({
        defaultLanguage: "ru",
      })
  );

  return null;
}

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeTransport = this.onChangeTransport.bind(this);
    this.handleMarker = this.handleMarker.bind(this);
    this.setSelectedMarker = this.setSelectedMarker.bind(this);
    this.remove = this.remove.bind(this);
    this.changeMarker = this.changeMarker.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      latitude: 66.25,
      longitude: 80.15,
      zoom: 3,
      selectedIndex: null,
      modal: false,
    };
  }

  componentDidMount() {
    MarkerService.getAll().then((response) => {
      this.setState({
        markers: response.data,
      });
    });
  }

  setSelectedMarker = (index) => {
    this.setState({ selectedIndex: index });
  };

  closePopup = () => {
    this.setSelectedMarker(null);
  };

  openPopup = (index) => {
    this.setSelectedMarker(index);
  };

  openModal = (event) => {
    this.setState({
      markerLat: event.lngLat.lat,
      markerLon: event.lngLat.lng,
      modal: true,
    });
  };

  closeModal = () => {
    this.setState({
      id: undefined,
      description: undefined,
      name: undefined,
      transport: undefined,
      modal: false,
    });
  };

  remove = (index) => {
    this.setState((prevState) => ({
      markers: prevState.markers.filter((marker, i) => index !== i),
      selectedIndex: null,
    }));
  };

  changeMarker(event) {
    if (this.props.user.user.role.name === "teacher") {
      this.setState({
        id: event.id,
        markerLat: event.lat,
        markerLon: event.lng,
        name: event.name,
        description: event.description,
        transport: event.transport,
      });
    }
  }

  handleMarker(e) {
    e.preventDefault();
    this.setState({
      loading: true,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.state.id
        ? this.updateMarker({
            id: this.state.id,
            name: this.state.name,
            description: this.state.description,
            transport: this.state.transport,
            lat: this.state.markerLat,
            lon: this.state.markerLon,
          })
        : this.addMarker({
            name: this.state.name,
            description: this.state.description,
            transport: this.state.transport,
            lat: this.state.markerLat,
            lon: this.state.markerLon,
          });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  addMarker(marker) {
    this.props
      .dispatch(
        createMarker({
          name: this.state.name,
          description: this.state.description,
          transport: this.state.transport,
          lat: marker.lat,
          lon: marker.lon,
        })
      )
      .then(() => {
        window.location.reload(false);
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  }

  updateMarker(marker) {
    this.props
      .dispatch(
        updateMarker({
          id: marker.id,
          name: this.state.name,
          description: this.state.description,
          transport: this.state.transport,
          lat: marker.lat,
          lon: marker.lon,
        })
      )
      .then(() => {
        this.props.navigate("/map", { replace: true });
        window.location.reload(false);
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

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeTransport(value) {
    this.setState({
      transport: value,
    });
  }

  handleDelete() {
    MarkerService.deleteById(this.state.id).then(
      () => {
        window.location.reload(false);
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          eventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    const { isLoggedIn, message, isTestExists, user: currentUser } = this.props;

    if (!isLoggedIn) {
      return <Navigate to="/" />;
    }
    if (isTestExists) {
      return <Navigate to="/test" />;
    }
    return (
      <div className="map-container">
        <Map
          {...this.state}
          onMove={(event) => this.setState(event.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
          locale="ru-RU"
          onDblClick={(event) =>
            currentUser.user.role.name === "teacher" && this.openModal(event)
          }
          doubleClickZoom={false}
        >
          {this.state.markers &&
            this.state.markers.map((marker, index) => {
              return (
                <CustomMarker
                  key={`marker-${index}`}
                  index={index}
                  marker={marker}
                  openPopup={this.openPopup}
                  changeMarker={this.changeMarker}
                />
              );
            })}
          {this.state.selectedIndex !== null && (
            <CustomPopup
              index={this.state.selectedIndex}
              marker={this.state.markers[this.state.selectedIndex]}
              closePopup={this.closePopup}
              remove={this.remove}
            />
          )}
          <DrawControl />
        </Map>
        <Modal
          isOpen={this.state.modal}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
        >
          <h2>{!this.state.id ? "Добавление метки" : "Изменение метки"}</h2>
          <Form
            onSubmit={this.handleMarker}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <label htmlFor="name">Название:</label>
              <Input
                className="form-control"
                name="name"
                type="text"
                value={this.state.name}
                onChange={this.onChangeName}
                validations={[required, nameValidator]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Описание:</label>
              <Textarea
                className="form-control small-12 medium-12 columns"
                name="description"
                value={this.state.description}
                rows="6"
                onChange={this.onChangeDescription}
                validations={[required, descriptionValidator]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="participant">Транспорт: </label>
              <CategoryList
                onChange={this.onChangeTransport}
                category={this.state.transport}
                type="Transport"
              />
            </div>
            <div className="form-group">
              <button
                className="btn btn-dark btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}

                <span>{this.state.id ? "Сохранить" : "Добавить"}</span>
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
          {this.state.id && (
            <button
              className="btn btn-dark btn-block"
              disabled={this.state.loading}
              onClick={this.handleDelete}
            >
              {this.state.loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}

              <span>Удалить</span>
            </button>
          )}
          <button
            className="btn btn-dark btn-block"
            disabled={this.state.loading}
            onClick={this.closeModal}
          >
            {this.state.loading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}

            <span>Отмена</span>
          </button>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const { isLoggedIn, user } = state.auth;
  const { message } = state.message;
  const { isTestExists } = state.test;

  return {
    user,
    isLoggedIn,
    message,
    isTestExists,
  };
}

export default connect(mapStateToProps)(MapComponent);
