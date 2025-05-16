import ky from "ky";

const api = ky.create({
  prefixUrl: "/api",
  credentials: "include",
});

export { api };
