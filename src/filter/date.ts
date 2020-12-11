import isArray from "lodash/isArray";
import _get from "lodash/get";
import _max from "lodash/max";
import _min from "lodash/min";

import _add from "date-fns/add";
import parse from "date-fns/parse";
import parseISO from "date-fns/parseISO";

/*
 * 关于日期这部分逐步移动到此处
 *
 */

const parseDate = (value, fmt = null) => {
  if (value && typeof value.getMonth === "function") {
    return value;
  }
  if (!fmt) {
    return parseISO(value);
  }

  return parse(value, fmt, new Date());
};

const inInterval = (date, intervalOptions) => {
  const chkDate = parseDate(date);
  const bouDate = _get(intervalOptions, "date", new Date());
  const mode = _get(intervalOptions, "mode", "interval");
  delete intervalOptions.date;
  delete intervalOptions.mode;

  let startOptions = null;
  let endOptions = null;
  if (isArray(intervalOptions) && intervalOptions.length === 2) {
    [startOptions, endOptions] = intervalOptions;
  } else {
    endOptions = intervalOptions;
  }
  const s = startOptions ? _add(bouDate, startOptions) : bouDate;
  const e = _add(bouDate, endOptions);

  const startDate = _min([s, e]);
  const endDate = _max([s, e]);

  if (mode === "before") {
    return chkDate <= startDate;
  }
  if (mode === "after") {
    return chkDate >= endDate;
  }
  return chkDate >= startDate && chkDate <= endDate;
};

export default {
  parseDate,
  inInterval,
};
