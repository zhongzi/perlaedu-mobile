const Home = () =>
  import(
    /* webpackChunkName: "bill-management-cost" */ "@/view/bill/management/cost/Home.vue"
  );
const List = () =>
  import(
    /* webpackChunkName: "bill-management-cost" */ "@/view/bill/management/cost/List.vue"
  );
const RechargeAi = () =>
  import(
    /* webpackChunkName: "bill-management-cost" */ "@/view/bill/management/cost/RechargeAi.vue"
  );

const costRoutes: any = [
  {
    path: ":orderId/cost",
    component: Home,
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        name: "billCostList",
        component: List,
        meta: { title: "充值明细" },
      },
      {
        path: "recharge-ai",
        name: "billCostRechargeAi",
        component: RechargeAi,
        meta: { title: "Ai教务充值" },
      },
    ],
  },
];

export default costRoutes;
