import { Component, Vue } from "vue-property-decorator";

import FileApi from "@/api/common/file";
import axios from "axios";

const urljoin = require("url-join");
const uuidv4 = require("uuid/v4");

@Component
export default class UploaderMixin extends Vue {
  uploadBlob(blob, type, prefix, suffix, callback, callbackPrg = null) {
    this.upload(blob, type, prefix, suffix, callback, callbackPrg);
  }

  uploadFile(file, type, prefix, callback, callbackPrg = null) {
    const suffixPos = file.name.lastIndexOf(".");
    const suffix = suffixPos >= 0 && file.name.substring(suffixPos);
    this.upload(file, type, prefix, suffix, callback, callbackPrg);
  }

  upload(file, type, prefix, suffix, callback, callbackPrg) {
    const key = urljoin(prefix, uuidv4() + suffix);

    this.fetchToken(type, key).then((resp) => {
      const token = resp.data.token;
      this.sendFile(file, key, token, callbackPrg)
        .then(() => {
          callback(token.url);
        })
        .catch((error) => console.log(error));
    });
  }

  fetchToken(type, key) {
    return FileApi.create({
      res: {
        type,
        key,
      },
      headers: null,
      args: null,
      query: null,
    });
  }
  sendFile(file, filename, token, callbackPrg) {
    const headers = {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
    };

    const formData = new FormData();
    formData.append("key", token.path);
    formData.append("policy", token.policy);
    formData.append("OSSAccessKeyId", token.accessid);
    formData.append("success_action_status", "200");
    formData.append("signature", token.signature);

    formData.append("name", filename);
    formData.append("file", file, filename);

    return axios.post(token.host, formData, {
      headers: headers,
      onUploadProgress: (result) => {
        callbackPrg &&
          callbackPrg(Math.round((result.loaded * 100) / result.total));
      },
    });
  }
}
