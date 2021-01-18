module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-pxtorem": {
      rootValue: 10,
      propList: ["*"],
    },
    // "postcss-rem-to-pixel": {
    //   rootValue: 10,
    //   unitPrecision: 5,
    //   propList: ["*"],
    //   selectorBlackList: [],
    //   replace: true,
    //   mediaQuery: false,
    //   minRemValue: 0,
    // },
    //    "postcss-px-to-viewport": {
    //      unitToConvert: "px",
    //      viewportWidth: 375,
    //      unitPrecision: 5,
    //      propList: ["*"],
    //      viewportUnit: "vw",
    //      fontViewportUnit: "vw",
    //      selectorBlackList: [],
    //      minPixelValue: 1,
    //      mediaQuery: false,
    //      replace: true,
    //      exclude: [],
    //      landscape: false,
    //      landscapeUnit: "vw",
    //      landscapeWidth: 568,
    //    },
  },
};
