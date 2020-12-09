import Vue from "vue";

import _get from "lodash/get";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";

const axios = require("axios");
const configs = cloneDeep(require("../configs.json"));

class QQMap {
  key: string = null;
  keyName: string = null;
  debouncedRequest: any = null;

  cached: any = {};

  constructor(key = null, keyName = null) {
    this.key = key || configs.qqMapKey;
    this.keyName = keyName || configs.qqMapName;
    this.debouncedRequest = debounce(this.request, 500, { maxWait: 1000 });
  }

  loadScripts() {
    return new Promise((resolve, reject) => {
      window.init = function () {
        resolve(window.TMap);
      };

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://map.qq.com/api/gljs?v=1.exp&callback=init&key=${this.key}&libraries=tools,geometry`;
      script.onerror = reject;
      document.head.appendChild(script);

      const scriptGeo = document.createElement("script");
      scriptGeo.type = "text/javascript";
      scriptGeo.src = `https://apis.map.qq.com/tools/geolocation/min?key=${this.key}&referer=${this.keyName}`;
      scriptGeo.onerror = reject;
      document.head.appendChild(scriptGeo);
    });
  }

  setCache(id, obj) {
    this.cached[id] = obj;
  }

  getCache(id) {
    return this.cached[id];
  }

  getMap(id, options = {}, reset = false) {
    if (reset) {
      this.destroyMap(id);
    }

    let isNew = false;
    let map = this.getCache(id);
    if (!map) {
      map = new window.TMap.Map(
        id,
        merge(
          {
            zoom: 17,
            minZoom: 14,
            maxZoom: 20,
            mapTypeControl: false,
            showControl: true,
            doubleClickZoom: true,
          },
          options
        )
      );
      this.setCache(id, map);
      isNew = true;
    }

    return { map, isNew };
  }

  destroyMap(id) {
    const map = this.getCache(id);
    if (map) {
      map.destroy();
      this.setCache(id, null);
    }
  }

  /*
   * TITLE: Webservice API
   * URL: https://lbs.qq.com/service/webService/webServiceGuide/webServiceOverview
   */
  request(url, callback) {
    axios
      .get(url, {
        headers: {},
      })
      .then((resp) => {
        callback(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getLocationURL({ title, address, coord }) {
    return `https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:${coord[0]},${coord[1]};title:${title};addr:${address}&key=${this.key}&referer=${this.keyName}`;
  }

  search({ keyword, boundary, callback }) {
    const url = `https://apis.map.qq.com/ws/place/v1/search?key=${this.key}&keyword=${keyword}&boundary=${boundary}`;
    this.request(url, callback);
  }

  suggestion({ keyword, region, region_fix = 0, callback = null }) {
    const url = `https://apis.map.qq.com/ws/place/v1/suggestion?key=${this.key}&keyword=${keyword}&region=${region}&region_fix=${region_fix}`;
    this.request(url, callback);
  }

  pathPlan({ from, to, waypoints = "", callback = null }) {
    const url = `https://apis.map.qq.com/ws/direction/v1/driving?key=${this.key}&from=${from}&to=${to}&waypoints=${waypoints}`;
    this.request(url, callback);
  }

  addr2gps({ address, callback }) {
    const url = `https://apis.map.qq.com/ws/geocoder/v1/?key=${this.key}&address=${address}`;
    this.debouncedRequest(url, callback);
  }

  gps2addr({ gps, callback }) {
    const url = `https://apis.map.qq.com/ws/geocoder/v1/?key=${this.key}&location=${gps}`;
    this.request(url, callback);
  }

  translate({ gps, type, callback }) {
    const url = `https://apis.map.qq.com/ws/coord/v1/translate?key=${this.key}&loctions=${gps}&type=${type}`;
    this.request(url, callback);
  }

  ipLocation({ ip, callback }) {
    let url = `https://apis.map.qq.com/ws/location/v1/ip?key=${this.key}`;
    url = ip ? `{url}&ip=${ip}` : url;
    this.request(url, callback);
  }

  getCurLocation({ callback }) {
    const GeoLocation = _get(window, "qq.maps.Geolocation");
    if (GeoLocation) {
      const fetcher = new GeoLocation(this.key, this.keyName);
      fetcher.getLocation(
        (result) => {
          callback(result);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.ipLocation({
        ip: null,
        callback: (result) => {
          callback(result.location);
        },
      });
    }
  }
}

export default function (pVue: typeof Vue, options = {}) {
  pVue.prototype.$QQMap = QQMap;
  pVue.prototype.$qqMap = new QQMap();
}
