import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/categories";

class CategoryService {
  async getAll() {
    return await axios.get(API_URL, { headers: await authHeader() });
  }
}

const categoryService = new CategoryService();

export default categoryService;
