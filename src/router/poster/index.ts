const Home = () =>
  import(/* webpackChunkName: "poster" */ "@/view/poster/Home.vue");
const Render = () =>
  import(/* webpackChunkName: "poster" */ "@/view/poster/Render.vue");
const Builder = () =>
  import(/* webpackChunkName: "poster" */ "@/view/poster/Builder.vue");

const posterRoutes: any = [
  {
    path: "/poster",
    component: Home,
    children: [
      {
        path: "render",
        name: "posterRender",
        component: Render,
        meta: { title: "海报制作" },
      },
      {
        path: "builder",
        name: "posterBuilder",
        component: Builder,
        meta: { title: "海报设计" },
      },
    ],
  },
];

export default posterRoutes;
