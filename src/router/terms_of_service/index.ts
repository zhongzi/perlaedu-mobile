const Home = () =>
  import(
    /* webpackChunkName: "terms-of-service" */ "@/view/terms-of-service/Home.vue"
  );
const Bill = () =>
  import(
    /* webpackChunkName: "terms-of-service" */ "@/view/terms-of-service/Bill.vue"
  );

const termsOfServiceRoutes: any = [
  {
    path: "/terms-of-service",
    component: Home,
    children: [
      {
        path: "bill",
        name: "termsOfServiceBill",
        component: Bill,
        meta: { title: "收款服务条款" },
      },
    ],
  },
];

export default termsOfServiceRoutes;
