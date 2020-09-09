import api from "../resource";

export default function (plural) {
  plural = "/crm" + plural;
  return api(plural);
}
