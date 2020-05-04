import api from "../resource";

export default function (plural) {
  plural = "/common" + plural;
  return api(plural);
}
