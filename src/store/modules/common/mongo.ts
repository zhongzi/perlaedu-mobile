import { mongoMerchant as mongoMerchantApi } from "@/api/common/mongo";
import { mongoMerchantZone as mongoMerchantZoneApi } from "@/api/common/mongo";
import { store } from "@jukejia/swift-resource";

const mongoMerchant = store(mongoMerchantApi);
const mongoMerchantZone = store(mongoMerchantZoneApi);
export { mongoMerchant, mongoMerchantZone };
