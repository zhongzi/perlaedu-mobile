import api from "../resource";

export default function (plural) {
  plural = "/campaign" + plural;
  return api(plural);
}
