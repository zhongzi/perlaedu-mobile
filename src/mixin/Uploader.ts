import { Component, Vue } from "vue-property-decorator";

import axios from "axios";
import format from "date-fns/format";
import imageCompression from "browser-image-compression";
import _get from "lodash/get";

import FileApi from "@/api/common/file";
import MediaFileApi from "@/api/media/media_file";

const urljoin = require("url-join");
const uuidv4 = require("uuid/v4");
const MD5 = require("crypto-js/md5");

@Component
export default class UploaderMixin extends Vue {
  uploadBlob(
    blob,
    type,
    prefix,
    suffix,
    callback,
    callbackPrg = null,
    fileOptions = null
  ) {
    this.upload(blob, type, prefix, suffix, callback, callbackPrg, fileOptions);
  }

  uploadFile(
    file,
    type,
    prefix,
    callback,
    callbackPrg = null,
    fileOptions = null
  ) {
    const suffixPos = file.name.lastIndexOf(".");
    const suffix = suffixPos >= 0 && file.name.substring(suffixPos);
    this.upload(
      file,
      type,
      prefix,
      suffix,
      callback,
      callbackPrg,
      (fileOptions = null)
    );
  }

  upload(
    file,
    type,
    prefix,
    suffix,
    callback,
    callbackPrg,
    fileOptions = null
  ) {
    prefix = urljoin(prefix, format(new Date(), "yyyyMMdd"));

    // md5
    this.md5(file, (md5) => {
      // 压缩
      this.compression(file, (compressedFile) => {
        // token & url
        const key = urljoin(prefix, md5 + suffix);
        this.fetchToken(type, key).then((resp) => {
          const token = resp.data.token;

          // media check & save
          const size = compressedFile.size;
          const url = token.url;
          this.createMediaFile(md5, size, url, fileOptions, (mediaFile) => {
            if (mediaFile.is_uploaded) {
              callbackPrg && callbackPrg(100);
              callback(mediaFile.url, mediaFile);
              return;
            }

            this.sendFile(compressedFile, key, token, callbackPrg)
              .then(() => {
                this.confirmedMediaFile(mediaFile, () => {
                  callback(mediaFile.url, mediaFile);
                });
              })
              .catch((error) => console.log(error));
          });
        });
      });
    });
  }

  md5(file, callback) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      callback(MD5(reader.result).toString());
    };
  }

  confirmedMediaFile(mediaFile, callback) {
    MediaFileApi.update({
      id: mediaFile.md5,
      res: {
        is_uploaded: true,
      },
      headers: null,
      args: null,
      query: null,
    }).then(() => {
      callback();
    });
  }

  createMediaFile(md5, size, url, fileOptions, callback) {
    MediaFileApi.create({
      res: {
        size: size,
        md5: md5,
        url: url,
        width: _get(fileOptions, "width", 0),
        height: _get(fileOptions, "height", 0),
      },
      headers: null,
      args: null,
      query: null,
    }).then((resp) => {
      callback(resp.data);
    });
  }

  compression(file, callback) {
    // console.log('originalFile instanceof Blob', file instanceof Blob); // true
    // console.log(`originalFile size ${file.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 1,
      useWebWorker: false,
    };
    imageCompression(file, options)
      .then(function (compressedFile) {
        // console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
        callback && callback(compressedFile);
      })
      .catch(function (error) {
        console.log(error.message);
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
