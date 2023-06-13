import TaskService from "../services/tasks.service";
import { CLEAR_MESSAGE, SET_MESSAGE } from "./types";

export const createTask = (task) => (dispatch) => {
  return TaskService.createNewTask(task).then(
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

export const updateTask = (task) => (dispatch) => {
  return TaskService.updateTask(task).then(
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
