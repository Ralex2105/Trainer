import React, { Component } from "react";
import { connect } from "react-redux";
import EventBus from "../../common/EventBus";
import { ShowForRoles } from "../permission/ShowRolesComponent";
import CardsService from "../../services/cards.service";

class CardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleReload() {
    window.location.reload(false);
  }

  handleDelete(e) {
    CardsService.deleteById(e.id).then(
      () => {
        this.handleReload();
      },
      (error) => {
        this.setState({
          cards:
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

  render() {
    const { test, cards } = this.props;
    if (cards) {
      const items = cards.map((card, i) => (
        <div className="col">
          <div className="card" key={card.id}>
            <img
              className="card-img-top"
              alt={card.image.name}
              src={`data:image/png;base64,${card.image.imageData}`}
              onClick={() => this.props.navigate("/cards/" + card.id)}
            />
            <div className="card-body">
              <div key={card.id}>
                {!test && (
                  <div className="d-flex my-3">
                    <strong>Ссылка: </strong>
                    <a href={card.link} className="mx-2">
                      {card.link}
                    </a>
                  </div>
                )}
                <p className="card-text">
                  <strong>Описание: </strong>
                  {card.description}
                </p>
              </div>
              <hr></hr>
              <div className="d-flex justify-content-between">
                <ShowForRoles permission="teacher">
                  <button
                    type="button"
                    className="btn btn-success"
                    disabled={this.state.loading}
                    onClick={() => this.props.navigate("/cards/" + card.id)}
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
                    onClick={() => this.handleDelete(card)}
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
          </div>
        </div>
      ));
      return <div className="row row-cols-3 g-3">{items}</div>;
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

export default connect(mapStateToProps)(CardList);
