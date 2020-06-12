const Home = () =>
  import(
    /* webpackChunkName: "bill-profile-order " */ "@/view/bill/profile/order/Home.vue"
  );

const List = () =>
  import(
    /* webpackChunkName: "bill-profile-order " */ "@/view/bill/profile/order/List.vue"
  );

const Detail = () =>
  import(
    /* webpackChunkName: "bill-profile-order " */ "@/view/bill/profile/order/Detail.vue"
  );

const orderRoutes: any = [
  {
    path: "orders",
    component: Home,
    name: "billProfileOrderHome",
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        name: "billProfileOrders",
        component: List,
        meta: { title: "订单" },
      },
      {
        path: "/:orderId",
        name: "billProfileOrderDetail",
        component: Detail,
        meta: { title: "订单详情" },
      },
    ],
  },
];

export default orderRoutes;
