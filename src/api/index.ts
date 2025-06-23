import ky from "ky";
import { getCookie } from "cookies-next";

const getToken = () => {
  return getCookie("authToken");
};

const api = ky.create({
  prefixUrl: "/api",
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getToken();

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

export { api };
