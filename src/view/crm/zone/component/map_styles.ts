import dates from "@/filter/date";

const styles = {
  defaultMarker: new window.TMap.MarkerStyle({
    width: 15,
    height: 18,
    src:
      "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png",
  }),
  curPositionMarker: new window.TMap.MarkerStyle({
    width: 25,
    height: 30,
    src:
      "https://files.perlaedu.com/mobile/default/map-marker-current-position.png",
  }),
  dzGray: new window.TMap.MarkerStyle({
    width: 20,
    height: 20,
    src: "https://files.perlaedu.com/mobile/default/map-marker-dz-gray.png",
  }),
  dzBlue: new window.TMap.MarkerStyle({
    width: 20,
    height: 20,
    src: "https://files.perlaedu.com/mobile/default/map-marker-dz-blue.png",
  }),
  dzOrange: new window.TMap.MarkerStyle({
    width: 20,
    height: 20,
    src: "https://files.perlaedu.com/mobile/default/map-marker-dz-orange.png",
  }),
  dzRed: new window.TMap.MarkerStyle({
    width: 20,
    height: 20,
    src: "https://files.perlaedu.com/mobile/default/map-marker-dz-red.png",
  }),
  qzGreen: new window.TMap.MarkerStyle({
    width: 30,
    height: 30,
    src: "https://files.perlaedu.com/mobile/default/map-marker-qz-green.png",
  }),
  qzPurple: new window.TMap.MarkerStyle({
    width: 30,
    height: 30,
    src: "https://files.perlaedu.com/mobile/default/map-marker-qz-purple.png",
  }),
  qzYellow: new window.TMap.MarkerStyle({
    width: 30,
    height: 30,
    src: "https://files.perlaedu.com/mobile/default/map-marker-qz-yellow.png",
  }),
};

const getStyleIdByMerchant = (m) => {
  if (m.related_merch_id && m.related_merch_id > 0) {
    return "qzGreen";
  }
  if (m.related_clue_id && m.related_clue_id > 0) {
    return "qzYellow";
  }
  if (m.notExisted) {
    return "dzGray";
  }
  if (m._created_at || m._updated_at) {
    return "qzPurple";
  }
  if (m.version) {
    const verDate = (dates as any).parseDate(m.version, "yyyy.M");
    if (dates.inInterval(verDate, { months: -3 })) {
      return "dzRed";
    }
    if (dates.inInterval(verDate, [{ months: -3 }, { months: -6 }])) {
      return "dzOrange";
    }
  }

  return "dzBlue";
};

export default {
  styles: styles,
  getStyleIdByMerchant,
};
