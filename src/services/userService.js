// import config from "config";
import { authHeader, handleResponse } from "../helpers";

export const userService = {
  getAll,
  getById
};

function getAll() {
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`http://localhost:3000/users`, requestOptions).then(
    handleResponse
  );
}

function getById(id) {
  console.log(id);
  const requestOptions = { method: "GET", headers: authHeader() };
  return fetch(`http://localhost:3000/users/${id}`, requestOptions).then(
    handleResponse
  );
}
