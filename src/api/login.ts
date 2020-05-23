import auth from "@/service/auth";

import { resourceV1 } from "./resource";
import { tools } from "../plugin/tools";

const userAPI = resourceV1("/users");
const openidAPI = resourceV1("/openids");

auth.fetchLoggedUser = function (next, to) {
  userAPI
    .get({
      id: "self",
      query: {
        next: tools.buildURL(to.fullPath),
      },
      headers: {},
      args: {},
    })
    .then((resp) => {
      const data = resp.data.data;
      if (data.user) {
        data.user.is_manager = data.is_manager;
        data.user.agent = data.agent;
        this.login({ user: data.user });
        return next(to);
      }
      location.href = data.next;
      next(false);
      return;
    })
    .catch((err) => {
      next(false);
      console.log(err);
    });
};

auth.fetchOpenid = function (next, to) {
  openidAPI
    .get({
      id: null,
      headers: {},
      args: {},
      query: {
        expose: "expose",
        next: tools.buildURL(to.fullPath),
      },
    })
    .then((resp) => {
      const data = resp.data.data;
      if (data.openid) {
        this.login({ openid: data.openid });
        return next(to);
      }
      location.href = data.next;
      next(false);
      return;
    })
    .catch((err) => {
      next(false);
      console.log(err);
    });
};

export default userAPI;
export { openidAPI };
