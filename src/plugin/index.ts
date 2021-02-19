import bus from "@jukejia/egret-utils/dist/plugins/bus";
import auth from "./auth";
import configs from "./configs";
import tools from "./tools";
import weixin from "./weixin";
import alipay from "./alipay";
import poster from "./poster";
import db from "./db";
import wework from "./wework";
import map from "./map";
import captcha from "./captcha";
import loadScript from "./loadScript";
import os from "./os";

const retina = require("@jukejia/retina");

export default [
  bus,
  retina,
  auth,
  configs,
  tools,
  weixin,
  alipay,
  poster,
  db,
  wework,
  map,
  captcha,
  loadScript,
  os,
];
