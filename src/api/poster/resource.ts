import api from "../resource";

export default function (plural) {
  plural = "/poster" + plural;
  return api(plural);
}
