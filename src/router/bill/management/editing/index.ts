const Home = () =>
  import(
    /* webpackChunkName: "bill-editing" */ "@/view/bill/management/editing/Home.vue"
  );
const Projects = () =>
  import(
    /* webpackChunkName: "bill-editing" */ "@/view/bill/management/editing/Projects.vue"
  );
const Items = () =>
  import(
    /* webpackChunkName: "bill-editing" */ "@/view/bill/management/editing/Items.vue"
  );
const Item = () =>
  import(
    /* webpackChunkName: "bill-editing" */ "@/view/bill/management/editing/Item.vue"
  );

const editingRoutes: any = [
  {
    path: "editing",
    component: Home,
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        name: "billEditingURL",
        component: Projects,
        meta: { title: "新的支付链接" },
      },
      {
        path: "projects",
        name: "billEditingProjects",
        component: Projects,
        meta: { title: "收款项目" },
      },
      {
        path: ":projectId/items",
        name: "billEditingItems",
        component: Items,
        meta: { title: "编辑 - 收款子目列表" },
      },
      {
        path: ":projectId/items/:itemId",
        name: "billEditingItem",
        component: Item,
        meta: { title: "编辑 - 收款子目" },
      },
    ],
  },
];

export default editingRoutes;
