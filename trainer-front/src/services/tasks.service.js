import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/tasks";

class TasksService {
  async getAll() {
    return await axios.get(API_URL, { headers: await authHeader() });
  }

  async getById(id) {
    return await axios.get(API_URL + "/" + id, { headers: await authHeader() });
  }

  async createNewTask(task) {
    let authHeaders = await authHeader();
    return await axios.post(
      API_URL,
      {
        direction: task.direction,
        participant: task.participant,
        transport: task.transport,
        description: task.description,
        image: task.image,
        link: task.link,
        typed: task.typed,
        answers: task.answers,
      },
      { headers: authHeaders }
    );
  }

  async updateTask(task) {
    let authHeaders = await authHeader();
    return await axios.put(
      API_URL + "/" + task.id,
      {
        id: task.id,
        direction: task.direction,
        participant: task.participant,
        transport: task.transport,
        description: task.description,
        image: task.image,
        link: task.link,
        typed: task.typed,
        answers: task.answers,
      },
      { headers: authHeaders }
    ).then((response)=>{
      return response;
    });
  }

  async deleteById(id) {
    return await axios.delete(API_URL + "/" + id, {
      headers: await authHeader(),
    });
  }
}

const tasksService = new TasksService();

export default tasksService;
