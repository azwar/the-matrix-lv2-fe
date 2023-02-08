import { getSession } from "next-auth/react";
import nookies, { parseCookies } from "nookies";
const { httpClent } = require("@/helpers/http");

export function findCoordinate(id) {
  const cookies = parseCookies();
  const token = cookies.token;
  const web3cred = cookies.user;
  let idNumber;

  try {
    idNumber = parseInt(id);
  } catch (error) {
    throw error;
  }

  if (token) {
    return httpClent(token)
      .post("/matrix/find-coordinate", {
        id: idNumber,
      })
      .then((res) => {
        if (res.status === 201) {
          return res.data;
        }
      });
  }

  return httpClent(token)
    .post("/matrix/web3/find-coordinate", {
      id: idNumber,
      web3_creds: web3cred,
    })
    .then((res) => {
      if (res.status === 201) {
        return res.data;
      }
    });
}
