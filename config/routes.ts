export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: '@/pages//User/login',
          },
        ],
      },
    ],
  },
  {
    path: '/workspace/project/:project_id',
    name: 'workspace',
    icon: 'code',
    component: '@/pages/Workspace/DataReviseList',
  },
  {
    path: '/workspace/project/:project_id/revision',
    name: 'revision',
    icon: 'rocket',
    component: '@/pages/Workspace/DataReviseView',
    hideInMenu: true
  },
  {
    path: '/',
    name: 'home',
    redirect: '/project/overview',
    hideInMenu: true
  },
  {
    path: '/project',
    name: 'project',
    icon: 'rocket',
    routes: [
      
      {
        path: '/project/overview',
        name: 'overview',
        icon: 'dashboard',
        component: '@/pages/Project/Overview'
      },
      {
        path: '/project/:id',
        name: 'detail',
        icon: 'dashboard',
        component: '@/pages/Project/Detail',
        hideInMenu: true
      }
    ]
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: '@/pages/Welcome',
    hideInMenu: true
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: '@/pages/Project/Overview',
    hideInMenu: true,
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: '@/pages/Welcome',
      },
    ],
  },
  {
    path: '/502',
    component: '@/pages/502',
  },
  {
    path: '/504',
    component: '@/pages/504',
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: '@/pages/TableList',
    hideInMenu: true
  },
  {
    component: '@/pages/404',
  },

];
