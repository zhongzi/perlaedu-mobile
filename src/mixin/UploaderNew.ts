import { Component, Vue } from "vue-property-decorator";

import axios from "axios";
import imageCompression from "browser-image-compression";

import _get from "lodash/get";
import merge from "lodash/merge";
import format from "date-fns/format";

import MediaApi from "@/api/media/media";

const urljoin = require("url-join");
const uuidv4 = require("uuid/v4");
const MD5 = require("crypto-js/md5");

@Component
export default class UploaderMixin extends Vue {
  requireMD5 = true;
  requiredCompression = true;

  uploadBlob(blob, type, kind, fileOptions, callback, callbackPrg = null) {
    this.upload(blob, type, kind, callback, callbackPrg, fileOptions);
  }

  uploadFile(file, type, kind, fileOptions, callback, callbackPrg = null) {
    this.upload(file, type, kind, callback, callbackPrg, fileOptions);
  }

  upload(file, type, kind, callback, callbackPrg = null, fileOptions = null) {
    // MD5
    this.md5(file, (md5) => {
      // media
      this.createMedia(md5, type, kind, fileOptions, (media) => {
        if (media.file.is_uploaded) {
          callbackPrg && callbackPrg(100);
          callback(media);
          return;
        }
        // 压缩
        this.compression(file, type, (compressedFile) => {
          // upload
          this.sendFile(
            compressedFile,
            media.title,
            media.file.upload_token,
            callbackPrg
          )
            .then(() => {
              // confirmed
              this.confirmedMedia(media, (m) => {
                callback(m);
              });
            })
            .catch((error) => console.log(error));
        });
      });
    });
  }

  md5(file, callback) {
    if (!this.requireMD5) {
      callback(uuidv4());
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(MD5(reader.result).toString());
    };
    reader.readAsBinaryString(file);
  }

  compression(file, type, callback) {
    /*
     * browser-image-compression 在window工作可能存在问题
     * window+微信 工作不正常
     * window+微信开发者工具，工作正常
     * window+chrome/edge，工作正常
     * 暂时如此规避
     */

    const isImage = type === "image";
    const isInPCWinWechat =
      this.$client.device.isPC &&
      this.$client.pc.isWin &&
      this.$client.browser.isMicromessenger;
    if (!isImage || !this.requiredCompression || isInPCWinWechat) {
      callback && callback(file);
      return;
    }
    const options = {
      maxSizeMB: 1,
      useWebWorker: false,
    };
    imageCompression(file, options)
      .then(function (compressedFile) {
        callback && callback(compressedFile);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }

  createMedia(md5, type, kind, fileOptions, callback) {
    MediaApi.create({
      query: {
        extras: JSON.stringify({
          Media: ["file", "url"],
          MediaFile: ["upload_token", "uri", "vod"],
        }),
      },
      res: {
        type: type,
        kind: kind,
        title: fileOptions.name,
        cover: fileOptions.cover,
        merchant_id: fileOptions.merchantId,
        file: merge(
          {
            md5,
          },
          fileOptions || {}
        ),
      },
      headers: null,
      args: null,
    })
      .then((resp) => {
        callback(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  confirmedMedia(media, callback) {
    MediaApi.update({
      id: media.id,
      query: {
        extras: JSON.stringify({
          Media: ["file", "url"],
        }),
      },
      res: {
        id: media.id,
        file: {
          md5: media.file.md5,
          url: media.file.upload_token.url,
          is_uploaded: true,
        },
      },
      headers: null,
      args: null,
    }).then((resp) => {
      callback(resp.data);
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
