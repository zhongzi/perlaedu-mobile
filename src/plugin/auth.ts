import Vue from "vue";
import auth from "@/service/auth";

export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$auth = auth;
}
