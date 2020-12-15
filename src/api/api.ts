import auth from "@/service/auth";
import router from "@/router";
import _get from "lodash/get";

const Fly = require("flyio/dist/npm/fly");
const configs = require("../configs.json");

const apiV1 = new Fly();
apiV1.config.baseURL = configs.apiPrefix + "/_api/";
apiV1.config.headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  withCredentials: true,
};

apiV1.interceptors.request.use(function (config) {
  if (!config.headers) {
    config.headers = {
      common: {},
    };
  }
  if (auth.token) {
    config.headers.Authorization = "Bearer " + auth.token;
  }
  return config;
});

apiV1.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      auth.gotoLogin();
      return;
    }
    return Promise.reject(error);
  }
);

const api = new Fly();
api.config.baseURL = configs.apiPrefix + "/v2/api/";
api.config.headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  withCredentials: true,
};

api.interceptors.request.use(function (config) {
  if (!config.headers) {
    config.headers = {
      common: {},
    };
  }
  if (auth.token) {
    config.headers.Authorization = "Bearer " + auth.token;
  }

  // 自动添加query中的_merchant_id_信息

  const _merchant_id_ = parseInt(
    router.currentRoute.query._merchant_id_ as any
  );
  if (_merchant_id_) {
    config.body = config.body || {};
    config.body["_merchant_id_"] = _merchant_id_;
  }

  console.log(config);
  return config;
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      auth.gotoLogin();
      return;
    }
    return Promise.reject(error);
  }
);

export default api;
export { apiV1 };
