import ky from "ky";

const isServer = typeof window === "undefined";
const baseUrl = isServer
  ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  : "/api";

const api = ky.create({
  prefixUrl: baseUrl,
  credentials: "include",
});

export { api, baseUrl };
