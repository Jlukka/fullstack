import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  console.log(response.data)
  return response.data;
};

const update = async (newObject) => {
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject);
  return response.data;
};

const deleteBlog = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = axios.delete(`${baseUrl}/${blogObject.id}`, config);
  return (await response).data;
};

export default { getAll, create, setToken, update, deleteBlog };
