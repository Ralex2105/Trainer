import React, { Component } from "react";

import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { history } from "../../helpers/history";
import { ShowForRoles } from "../permission/ShowRolesComponent";
import EventBus from "../../common/EventBus";
import CardsList from "./CardsList";
import CardsService from "../../services/cards.service"

class Cards extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      cards: "",
    };

  }

  nextPath(path) {
    history.push(path);
    window.location.reload(false);
  }

  componentDidMount() {
    CardsService.getAll().then(
      (response) => {
        this.setState({
          cards: response.data,
        });

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

  render() {
    const { isLoggedIn, isTestExists } = this.props;
    if (!isLoggedIn && !this.state.content) {
      return <Navigate to="/" />;
    }
    if (isTestExists) {
      return <Navigate to="/test" />;
    }
    return (
      <div className="card bg-light text-dark ">
        <ShowForRoles permission="teacher">
          <button
            type="button"
            className="btn btn-success"
            onClick={() => this.nextPath("/cards/add")}
          >
            Добавить карточку
          </button>
        </ShowForRoles>
        <CardsList cards={this.state.cards} navigate={this.props.navigate} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const {isTestExists} = state.test;
  return {
    isLoggedIn,
    isTestExists,
  };
}

export default connect(mapStateToProps)(Cards);
