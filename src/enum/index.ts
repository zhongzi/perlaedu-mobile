import forIn from "lodash/forIn";

const toOptions = (status) => {
  const options = [];
  forIn(status, (v: any, k: any) => {
    if (v.unSelected) return;

    options.push({
      key: v.text,
      value: k,
    });
  });
  return options;
};

export { toOptions };
