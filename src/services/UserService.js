import Router from "next/router";
import { useAccount, useDisconnect } from "wagmi";
const { httpClent } = require("@/helpers/http");

export function login(username, password) {
  return httpClent()
    .post("/auth/login", {
      username: username,
      password: password,
    })
    .then((res) => {
      if (res.data) {
        return res.data;
      }

      return res;
    })
    .catch((err) => {
      if (err.response?.data) {
        throw err.response?.data;
      }

      throw err;
    });
}
