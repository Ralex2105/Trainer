import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/markers";

class MarkerService {
  async getAll() {
    return await axios.get(API_URL, { headers: await authHeader() });
  }

  async createMarker(marker) {
    return await axios.post(
      API_URL,
      { lat: marker.lat, lon: marker.lon, name: marker.name, description: marker.description, transport: marker.transport },
      { headers: await authHeader() }
    );
  }

  async updateMarker(marker) {
    let authHeaders = await authHeader();
    return await axios
      .put(
        API_URL + "/" + marker.id,
        {
          id: marker.id,
          lat: marker.lat,
          lon: marker.lon,
          name: marker.name,
          description: marker.description,
          transport: marker.transport,
        },
        { headers: authHeaders }
      )
      .then((response) => {
        return response;
      });
  }

  async deleteById(id) {
    return await axios.delete(API_URL + "/" + id, {
      headers: await authHeader(),
    });
  }
}

const markerService = new MarkerService();

export default markerService;
