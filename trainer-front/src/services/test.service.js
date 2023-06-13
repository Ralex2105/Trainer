import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/tests";

class TestsService {
  async getAll() {
    return await axios.get(API_URL, { headers: await authHeader() });
  }

  async getAllForUser(id) {
    return await axios.get(API_URL + "/user/" + id, { headers: await authHeader() });
  }

  async getNonCompleteTestForUser(id) {
    return await axios.get(API_URL + "/noncomplete/user/" + id, { headers: await authHeader() });
  }


  async generateTest(nums, directionId, participantId, transportId) {
    let authHeaders = await authHeader();
    authHeaders["Content-Type"] = "multipart/form-data";

    return await axios
      .post(
        API_URL + "/generate",
        { nums: nums, direction: directionId, participant: participantId, transport: transportId },
        { headers: authHeaders }
      )
      .then((response) => {
        localStorage.setItem("test", JSON.stringify({isTestExists: true}));
        return response.data;
      });
  }

  async completeTest(test) {
    return await axios
      .put(
        API_URL + "/" + test.id,
        { "id": test.id, "date": test.date, "tasks": test.tasks,  "complete": true },
        { headers: await authHeader() }
      )
      .then((response) => {
        localStorage.removeItem("test");
        return response;
      });
  }

  async cancelTest(id) {
    return await axios.delete(API_URL + "/" + id, {
      headers: await authHeader(),
    }).then(
      (response) => {
        localStorage.removeItem("test");
        return response;
      }
    );
  }

  async deleteTaskForTest(id) {
    return await axios.delete(API_URL + "/task/" + id, {
      headers: await authHeader(),
    }).then(
      (response) => {
        return response;
      }
    );
  }
}

const testsService = new TestsService();

export default testsService;
