import {
    TEST_CREATED,
    SET_MESSAGE,
    CLEAR_MESSAGE,
  } from "./types";
  
  import testsService from "../services/test.service";
  
  export const generateTest = (numOfTask, direction, participant, transport) => (dispatch) => {
    return testsService
    .generateTest(numOfTask, direction, participant, transport)
    .then(
      () => {
        dispatch({ type: TEST_CREATED });
        dispatch({
          type: CLEAR_MESSAGE,
        });

        return Promise.resolve();
      },
      (error) => {
        dispatch({
          type: SET_MESSAGE,
          payload: error.response.data,
        });

        return Promise.reject();
      }
    )
  };
  

  export const getNonCompleteTestForUser = (id) => (dispatch) => {
    return testsService.getNonCompleteTestForUser(id).then(
        (response) => {
          dispatch({
            type: TEST_CREATED
          })
          return response;
        },
      );
  }
