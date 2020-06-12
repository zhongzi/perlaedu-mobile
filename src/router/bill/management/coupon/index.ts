const Home = () =>
  import(
    /* webpackChunkName: "bill-management-coupon " */ "@/view/bill/management/coupon/Home.vue"
  );

const List = () =>
  import(
    /* webpackChunkName: "bill-management-coupon " */ "@/view/bill/management/coupon/List.vue"
  );

const Detail = () =>
  import(
    /* webpackChunkName: "bill-management-coupon " */ "@/view/bill/management/coupon/Detail.vue"
  );

const BalanceList = () =>
  import(
    /* webpackChunkName: "bill-management-coupon " */ "@/view/bill/management/coupon/BalanceList.vue"
  );

const couponRoutes: any = [
  {
    path: "coupons",
    component: Home,
    name: "billManagementCouponHome",
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        name: "billManagementCoupons",
        component: List,
        meta: { title: "已核销列表" },
      },
      {
        path: "balances",
        name: "billManagementCouponBalances",
        component: BalanceList,
        meta: { title: "保证金变动明细" },
      },
      {
        path: ":couponId",
        name: "billManagementCouponDetail",
        component: Detail,
        meta: { title: "优惠券" },
      },
    ],
  },
];

export default couponRoutes;
