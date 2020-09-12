const Home = () =>
  import(
    /* webpackChunkName: "bill-profile " */ "@/view/bill/profile/Home.vue"
  );

const Dashboard = () =>
  import(
    /* webpackChunkName: "bill-profile " */ "@/view/bill/profile/Dashboard.vue"
  );

import couponRoutes from "./coupon";
// import orderRoutes from "./order";

const profileRoutes: any = [
  {
    path: "profile",
    component: Home,
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    redirect: {
      name: "billProfileDashboard",
    },
    children: [
      {
        path: "dashboard",
        name: "billProfileDashboard",
        component: Dashboard,
        meta: { title: "钱包" },
      },
    ].concat(couponRoutes /*orderRoutes*/),
  },
];

export default profileRoutes;
