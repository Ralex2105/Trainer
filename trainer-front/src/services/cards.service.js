import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/cards";

class CardsService {
  async getAll() {
    return await axios.get(API_URL, { headers: await authHeader() });
  }

  async getById(id) {
    return await axios.get(API_URL + "/" + id, { headers: await authHeader() });
  }

  async createNewCard(card) {
    let authHeaders = await authHeader();
    return await axios.post(
      API_URL,
      {
        description: card.description,
        image: card.image,
        link: card.link,
      },
      { headers: authHeaders }
    );
  }

  async updateCard(card) {
    let authHeaders = await authHeader();
    return await axios.put(
      API_URL + "/" + card.id,
      {
        id: card.id,
        description: card.description,
        image: card.image,
        link: card.link,
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

const cardsService = new CardsService();

export default cardsService;
