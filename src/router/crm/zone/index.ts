const Home = () =>
  import(/* webpackChunkName: "crm-zone" */ "@/view/crm/zone/Home.vue");
const Dashboard = () =>
  import(/* webpackChunkName: "crm-zone" */ "@/view/crm/zone/Dashboard.vue");

const Merchant = () =>
  import(/* webpackChunkName: "crm-zone" */ "@/view/crm/zone/Merchant.vue");

const MerchantEditing = () =>
  import(
    /* webpackChunkName: "crm-zone" */ "@/view/crm/zone/MerchantEditing.vue"
  );

const zoneRoutes: any = [
  {
    path: "zones",
    component: Home,
    name: "crmZoneHome",
    redirect: {
      name: "crmZoneList",
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        name: "crmZoneList",
        component: Dashboard,
        meta: { title: "客户地图", keepAlive: true },
      },
      {
        path: "merchants/:merchantId",
        name: "crmMerchant",
        component: Merchant,
        meta: { title: "机构信息", keepAlive: true },
      },
      {
        path: "merchants/:merchantId/editing",
        name: "crmMerchantEditing",
        component: MerchantEditing,
        meta: { title: "机构编辑", keepAlive: true },
      },
    ],
  },
];

export default zoneRoutes;
