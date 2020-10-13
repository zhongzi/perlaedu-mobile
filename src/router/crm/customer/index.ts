const Home = () =>
  import(/* webpackChunkName: "crm-customer" */ "@/view/crm/customer/Home.vue");
const List = () =>
  import(/* webpackChunkName: "crm-customer" */ "@/view/crm/customer/List.vue");
const Detail = () =>
  import(
    /* webpackChunkName: "crm-customer" */ "@/view/crm/customer/Detail.vue"
  );

const Editing = () =>
  import(
    /* webpackChunkName: "crm-customer" */ "@/view/crm/customer/Editing.vue"
  );

const EditingAction = () =>
  import(
    /* webpackChunkName: "crm-customer" */ "@/view/crm/customer/EditingAction.vue"
  );

const customerRoutes: any = [
  {
    path: "customers",
    component: Home,
    name: "crmCustomerHome",
    redirect: {
      name: "crmCustomerList",
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        name: "crmCustomerList",
        component: List,
        meta: { title: "客户列表", keepAlive: true },
        // meta: { title: "客户列表" },
      },
      {
        path: ":customerId",
        name: "crmCustomerDetail",
        component: Detail,
        meta: { title: "客户详情" },
      },
      {
        path: ":customerId/editing",
        name: "crmCustomerEditing",
        component: Editing,
        meta: { title: "客户详情" },
      },
      {
        path: ":customerId/ections/:actionId/editing",
        name: "crmCustomerActionEditing",
        component: EditingAction,
        meta: { title: "客户跟踪信息编辑" },
      },
    ],
  },
];

export default customerRoutes;
