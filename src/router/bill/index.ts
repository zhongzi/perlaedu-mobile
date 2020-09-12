const Home = () =>
  import(/* webpackChunkName: "bill" */ "@/view/bill/Home.vue");
const Bill = () =>
  import(/* webpackChunkName: "bill" */ "@/view/bill/Bill.vue");
const BillConfigure = () =>
  import(/* webpackChunkName: "bill" */ "@/view/bill/BillConfigure.vue");
const BillSuccess = () =>
  import(/* webpackChunkName: "bill" */ "@/view/bill/BillSuccess.vue");

import managementRoutes from "./management";
import profileRoutes from "./profile";

const billRoutes: any = [
  {
    path: "/bills",
    component: Home,
    redirect: {
      name: "billManagementDashboard",
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "payment/:merchantId/:projectId/:openid/:items",
        name: "bill",
        component: Bill,
        meta: {
          title: "优惠套餐",
          hideCopyright: true,
        },
      },
      {
        path: "payment/:merchantId/:projectId/:openid/:items/configure",
        name: "billConfigure",
        component: BillConfigure,
        meta: {
          title: "指定可选套餐",
          copyrightStyle: {
            color: "#fff",
            background: "linear-gradient(123deg, #ffa118 0%, #ff8306 100%)",
          },
        },
      },
      {
        path: "payment/success",
        name: "billSuccess",
        component: BillSuccess,
        meta: {
          title: "支付成功",
          copyrightStyle: {
            color: "#fff",
            background: "linear-gradient(123deg, #ffa118 0%, #ff8306 100%)",
          },
        },
      },
    ].concat(managementRoutes, profileRoutes),
  },
];

export default billRoutes;
