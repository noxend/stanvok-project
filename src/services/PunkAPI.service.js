import axios from 'axios';

class PunkAPI {
  getSingle = async (id) => {
    const res = await axios.get(`/beers/${id}`);
    return res.data;
  };
}

export default new PunkAPI();
