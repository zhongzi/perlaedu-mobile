import api from "../resource";

export default function (plural) {
  plural = "/notice" + plural;
  return api(plural);
}
