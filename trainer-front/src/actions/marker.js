import markerService from "../services/markers.service";
import { CLEAR_MESSAGE, SET_MESSAGE } from "./types";

export const createMarker = (marker) => (dispatch) => {
  return markerService.createMarker(marker).then(
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

export const updateMarker = (marker) => (dispatch) => {
  return markerService.updateMarker(marker).then(
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
