import CardsService from "../services/cards.service";
import { CLEAR_MESSAGE, SET_MESSAGE } from "./types";

export const createCard = (card) => (dispatch) => {
  return CardsService.createNewCard(card).then(
    () => {
      dispatch({
        type: CLEAR_MESSAGE,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data) ||
        error.message ||
        error.toString();

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return Promise.reject();
    }
  );
};

export const updateCard = (card) => (dispatch) => {
  return CardsService.updateCard(card).then(
    () => {
      dispatch({
        type: CLEAR_MESSAGE,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response && error.response.data) ||
        error.message ||
        error.toString();

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return Promise.reject();
    }
  );
};
