import auth from "@/service/auth";

import { resourceV1 } from "./resource";
import { tools } from "../plugin/tools";

const userAPI = resourceV1("/users");
const openidAPI = resourceV1("/openids");

auth.fetchLoggedUser = function (next = null, to = null, callback = null) {
  userAPI
    .get({
      id: "self",
      query: {
        next: to ? tools.buildURL(to.fullPath) : window.location.href,
      },
      headers: {},
      args: {},
    })
    .then((resp) => {
      const data = resp.data.data;
      if (data.user) {
        data.user.is_subscribed = data.is_subscribed;
        data.user.is_manager = data.is_manager;
        data.user.agent = data.agent;
        this.login({ user: data.user });

        callback && callback();
        return next && next(to);
      }
      location.href = data.next;
      next && next(false);
      return;
    })
    .catch((err) => {
      next && next(false);
      console.log(err);
    });
};

auth.fetchOpenid = function (next = null, to = null) {
  openidAPI
    .get({
      id: null,
      headers: {},
      args: {},
      query: {
        expose: "expose",
        next: to ? tools.buildURL(to.fullPath) : window.location.href,
      },
    })
    .then((resp) => {
      const data = resp.data.data;
      if (data.openid) {
        this.login({ openid: data.openid });
        return next && next(to);
      }
      location.href = data.next;
      next && next(false);
      return;
    })
    .catch((err) => {
      next && next(false);
      console.log(err);
    });
};

export default userAPI;
export { openidAPI };
