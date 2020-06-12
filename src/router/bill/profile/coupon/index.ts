const Home = () =>
  import(
    /* webpackChunkName: "bill-profile-coupon " */ "@/view/bill/profile/coupon/Home.vue"
  );

const List = () =>
  import(
    /* webpackChunkName: "bill-profile-coupon " */ "@/view/bill/profile/coupon/List.vue"
  );

const Detail = () =>
  import(
    /* webpackChunkName: "bill-profile-coupon " */ "@/view/bill/profile/coupon/Detail.vue"
  );

const couponRoutes: any = [
  {
    path: "coupons",
    component: Home,
    name: "billProfileCouponHome",
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        name: "billProfileCoupons",
        component: List,
        meta: { title: "优惠券" },
      },
      {
        path: ":couponId",
        name: "billProfileCouponDetail",
        component: Detail,
        meta: { title: "优惠券详情" },
      },
    ],
  },
];

export default couponRoutes;
