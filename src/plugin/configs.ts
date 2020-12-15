import Vue from "vue";

import settingApi from "@/api/core/setting";
import filters from "@/filter";

import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";
import isEmpty from "lodash/isEmpty";

import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";

const isProduction = process.env.NODE_ENV === "production";
const configs = cloneDeep(require("../configs.json"));

// 加载预设配置项
const keys = ["master_merchant_id"];

const loadDictionary = (callback) => {
  settingApi
    .list({
      query: {
        key: keys,
      },
      headers: {},
      args: {},
    })
    .then((resp) => {
      forEach(resp.data.data, (dic) => {
        configs[dic.key] = dic.value;
      });
      callback && callback();
    })
    .catch((e) => {
      console.log(e);
    });
};

// 临时
const frontURLResolver = {
  makeURL: (uri, query = {}) => {
    const separator = uri.indexOf("?") !== -1 ? "&" : "?";
    const url = isEmpty(query)
      ? uri
      : uri +
        separator +
        Object.keys(query)
          .map((key) => key + "=" + query[key])
          .join("&");
    return isProduction ? url : configs.frontURLBase + url;
  },
  getMerchantQrcode: (merchant) => {
    const uri = `/merchants/${merchant.id}/qrcode`;
    return frontURLResolver.makeURL(uri);
  },
  getBirthdayCalendar: (merchant) => {
    const today = new Date();
    const start = filters.defaultDay(startOfMonth(today));
    const end = filters.defaultDay(endOfMonth(today));

    const uri = `/birthday_calendar?start_date=${start}&end_date=${end}&merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri);
  },
  getRechargedList: (merchant) => {
    const uri = `/lowbatterys?lower=3&valid_days=30&merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri);
  },
  getSetting: (merchant) => {
    const uri = `/merchants/${merchant.id}/edit?config=True`;
    return frontURLResolver.makeURL(uri);
  },
  getScheduleOnOne: (merchant) => {
    const uri = `/one_on_one?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri);
  },
  getGroupOprs: (merchant) => {
    const uri = `/group_oprs?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri);
  },
  getMessages: (merchant, query = { original: true, group_only: true }) => {
    const uri = `/messages?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri, query);
  },
  getRequests: (merchant, query = { type_: 1 }) => {
    const uri = `/_requests?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri, query);
  },
  getLeaveTag: (merchant, query = null) => {
    const uri = `/merchants/${merchant.id}/tag_leave_trans`;
    return frontURLResolver.makeURL(uri, query);
  },
  getTimelines: (merchant, query = null) => {
    const uri = `/timelines?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri, query);
  },
  getMessage: (merchant, query = { type_: 1, options: 8, nohup: false }) => {
    const uri = `/message?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri, query);
  },
  getOnlineCourses: (
    merchant,
    query = { show_status: true, show_internal: 1 }
  ) => {
    const uri = `/online_courses?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri, query);
  },
  getBookings: (merchant, query = { type_: 2 }) => {
    const uri = `/bookings?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri, query);
  },
  getImports: (merchant, query = null) => {
    const uri = `/merchants/${merchant.id}/import`;
    return frontURLResolver.makeURL(uri, query);
  },
  getAlarms: (merchant, query = null) => {
    const uri = `/alarms?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri, query);
  },
  addPerson: (merchant, query = null) => {
    const uri = `/persons/new/info?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri, query);
  },
  listPersons: (merchant, query = null) => {
    const uri = `/persons?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri, query);
  },
  // 添加教务
  addAssistant: (merchant, query = { role: 32 }) => {
    return frontURLResolver.addPerson(merchant, query);
  },
  // 添加老师
  addTeacher: (merchant, query = { role: 8 }) => {
    return frontURLResolver.addPerson(merchant, query);
  },
  // 添加学生
  addStudent: (merchant, query = { role: 4 }) => {
    return frontURLResolver.addPerson(merchant, query);
  },
  // 教务列表
  listAssistants: (merchant, query = { role: 32 }) => {
    return frontURLResolver.listPersons(merchant, query);
  },
  // 老师列表
  listTeachers: (merchant, query = { role: 8 }) => {
    return frontURLResolver.listPersons(merchant, query);
  },
  // 学生列表
  listStudents: (merchant, query = { role: 4 }) => {
    return frontURLResolver.listPersons(merchant, query);
  },
  // 班级
  addGroup: (merchant, query = null) => {
    const uri = `/groups/new/info?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri, query);
  },
  listGroups: (merchant, query = null) => {
    const uri = `/groups?merchant_id=${merchant.id}`;
    return frontURLResolver.makeURL(uri, query);
  },
  // 课时明细
  listTagTrans: (merchant, query = null) => {
    const uri = `/merchants/${merchant.id}/tag_trans`;
    return frontURLResolver.makeURL(uri, query);
  },
};

export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$configs = configs;
  pVue.prototype.$frontURLResolver = frontURLResolver;
}

export { loadDictionary };
