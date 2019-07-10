import axios from 'axios';

class PunkAPI {
  getAll = async () => {
    const res = await axios.get('/beers?page=1&per_page=80');
    return res.data;
  };

  getSingle = async (id) => {
    const res = await axios.get(`/beers/${id}`);
    return res.data;
  };

  getRandom = async () => {
    const res = await axios.get('/beers/random');
    return res.data;
  };
}

export default new PunkAPI();
