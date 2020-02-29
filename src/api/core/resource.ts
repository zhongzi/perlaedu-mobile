import api from "../resource";

export default function(plural) {
  plural = "/core" + plural;
  return api(plural);
}
