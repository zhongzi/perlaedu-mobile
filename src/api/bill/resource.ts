import api from "../resource";

export default function (plural) {
  plural = "/bill" + plural;
  return api(plural);
}
