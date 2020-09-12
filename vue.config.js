const WebpackAliyunOss = require("webpack-aliyun-oss");
const uuidv4 = require("uuid/v4");
const urljoin = require("url-join");

const isProduction = process.env.NODE_ENV === "production";
const isTesting = process.env.TESTING === "true";
const isNeedPublish = process.env.NEED_PUBLISH === "true";
const target = process.env.TARGET;

let configs = {};
if (isProduction && isNeedPublish) {
  configs.baseURL = "https://files.perlaedu.com";

  configs.ossPath =
    target === "production"
      ? urljoin("mobile/spa", uuidv4())
      : urljoin("mobile/spa-test", uuidv4());
  configs.ossEndpoint = "oss-cn-shenzhen";
  configs.ossBucket = process.env.OSS_BUCKET;
  configs.ossKey = process.env.OSS_ACCESSKEYID;
  configs.ossSecret = process.env.OSS_ACCESSKEYSECRET;

  configs.publicPath = urljoin(configs.baseURL, configs.ossPath);
}

module.exports = {
  publicPath: configs.publicPath || "/mobile/",
  pages: {
    index: {
      entry: "src/main.ts",
      template: "public/index.html",
      filename: "index.html",
      title: "AI教务",
    },
  },
  devServer: {
    open: true,
    hot: true,
    progress: true,
    inline: true,
    disableHostCheck: true,
    watchContentBase: true,
    proxy: {
      "/_api": {
        target: "http://127.0.0.1:5000",
        secure: false,
        changeOrigin: true,
        headers: {
          Connection: "keep-alive",
        },
      },
      "/r": {
        target: "http://127.0.0.1:5000",
        secure: false,
        changeOrigin: true,
        headers: {
          Connection: "keep-alive",
        },
      },
      "/wechat": {
        target: "http://127.0.0.1:5000",
        secure: false,
        changeOrigin: true,
        headers: {
          Connection: "keep-alive",
        },
      },
      "/v2": {
        target: "http://127.0.0.1:5000",
        secure: false,
        changeOrigin: true,
        headers: {
          Connection: "keep-alive",
        },
      },
      "/campaign": {
        target: "https://files.perlaedu.com",
        changeOrigin: true,
        headers: {
          Connection: "keep-alive",
        },
      },
    },
  },
  configureWebpack: (config) => {
    config.output.filename = isTesting
      ? "[name].[hash].js"
      : "[name].[contenthash].js";

    isProduction &&
      isNeedPublish &&
      config.plugins.push(
        new WebpackAliyunOss({
          from: ["./dist/**"],
          dist: configs.ossPath,
          region: configs.ossEndpoint,
          accessKeyId: configs.ossKey,
          accessKeySecret: configs.ossSecret,
          bucket: configs.ossBucket,
        })
      );
  },
};
