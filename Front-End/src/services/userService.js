import { authHeader, handleResponse } from "../helpers";

export const userService = {
  getAll,
  getById,
  getByCourse
};

function getAll() {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`http://localhost:3000/users`, requestOptions).then(
    handleResponse
  );
}

function getById(id) {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`http://localhost:3000/users/${id}`, requestOptions).then(
    handleResponse
  );
}

function getByCourse(id, name) {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(
    `http://localhost:3000/?user=${id}&course=${name}`,
    requestOptions
  ).then(handleResponse);
}
