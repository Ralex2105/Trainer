import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/answers";

class AnswerService {
  async getAll() {
    return await axios.get(API_URL, { headers: await authHeader() });
  }

  async addNewAnswer(answer) {
    return await axios.post(API_URL, { "answer": answer.answer, "correct": answer.correct}, {headers: await authHeader() });
  }


  async deleteById(id)
  {
    return await axios.delete(API_URL + "/" + id, { headers: await authHeader()});
  }
}

const answerService = new AnswerService();

export default answerService;
