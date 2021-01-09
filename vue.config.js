const uuidv4 = require("uuid/v4");
const urljoin = require("url-join");

const WebpackAliyunOss = require("webpack-aliyun-oss");

const configs = {
  isProduction: process.env.NODE_ENV === "production",
  isTesting: process.env.TESTING || false,
  isNeedPublish: process.env.NEED_PUBLISH || false,
  target: process.env.TARGET,
};

if (configs.isProduction && configs.isNeedPublish) {
  configs.baseURL = "https://files.perlaedu.com";
  configs.ossPath =
    configs.target === "production"
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
      "/proxy": {
        target: "https://coopposer.perlaedu.com",
        secure: false,
        changeOrigin: true,
      },
    },
  },
  configureWebpack: (config) => {
    config.output.filename = !configs.isProduction
      ? "[name].[hash].js"
      : "[name].[contenthash].js";

    configs.isNeedPublish &&
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
