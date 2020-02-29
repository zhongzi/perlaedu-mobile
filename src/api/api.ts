import auth from "@/service/auth";

const Fly = require("flyio/dist/npm/fly");
const configs = require("../configs.json");

const api = new Fly();
api.config.baseURL = configs.apiPrefix + "/v2/api/";
api.config.headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  withCredentials: true
};

api.interceptors.request.use(function(config) {
  if (!config.headers) {
    config.headers = {
      common: {}
    };
  }
  if (auth.token) {
    config.headers.Authorization = "Bearer " + auth.token;
  }
  return config;
});

api.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response && error.response.status === 401) {
      auth.gotoLogin();
      return;
    }
    return Promise.reject(error);
  }
);

export default api;
