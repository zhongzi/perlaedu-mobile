import api from "./api";
import { apiV1 } from "./api";
import { resource } from "@jukejia/swift-resource";

export default function (plural) {
  return resource(api, plural);
}

const resourceV1 = function (plural) {
  return resource(apiV1, plural);
};
export { resourceV1 };
