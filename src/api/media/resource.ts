import api from "../resource";

export default function (plural) {
  plural = "/media" + plural;
  return api(plural);
}
