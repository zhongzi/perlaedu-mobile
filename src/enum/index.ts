import forIn from "lodash/forIn";

const toOptions = (status) => {
  const options = [];
  forIn(status, (v: any, k: any) => {
    options.push({
      key: v.text,
      value: k,
    });
  });
  return options;
};

export { toOptions };
