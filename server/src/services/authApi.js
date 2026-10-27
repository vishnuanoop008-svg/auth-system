import axios from "axios";

const API_URL = "http://localhost:3000/users";

export async function loginUser(email) {
  const response = await axios.get(API_URL, {
    params: { email },
  });

  return response.data;
}

export async function registerUser(userData) {
  const response = await axios.post(API_URL, userData);

  return response.data;
}

export async function getUserById(id) {
  const response = await axios.get(`${API_URL}/${id}`);

  return response.data;
}

export async function checkUsername(username) {
  const response = await axios.get(API_URL, {
    params: { username },
  });

  return response.data.length > 0;
}

export async function checkEmail(email) {
  const response = await axios.get(API_URL, {
    params: { email },
  });

  return response.data.length > 0;
}