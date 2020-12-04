import resource from "./resource";

const mongoMerchant = resource("/mongo/merchants");
const mongoMerchantZone = resource("/mongo/merchant_zones");

export { mongoMerchant, mongoMerchantZone };
