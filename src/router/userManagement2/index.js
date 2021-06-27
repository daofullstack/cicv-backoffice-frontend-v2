const Users = () => import('@/views/userManagement2/Users');
const UsersTable = () => import('@/views/userManagement2/users/Table');
const UsersForm = () => import('@/views/userManagement2/users/Form');
const PendingUsersTable = () => import('@/views/userManagement2/pendingUsers/Table');

const userManagement2 = [
  {
    path: '/boardingtype',
    name: 'boardingtype',
    meta: { title: 'User Management 2', layout: 'admin', requiresAuth: true },
    component: Users,
    redirect: '/boardingtype/table',
    children: [
      {
        path: '/boardingtype/table',
        name: 'usersTable2',
        parent: 'boardingtype',
        component: UsersTable,
        props: true,
        meta: {
          title: 'Users Table',
          layout: 'admin',
          requiresAuth: true,
          requiresAccess: true
        }
      },
      {
        path: '/boardingtype/add',
        name: 'usersAdd2',
        parent: 'boardingtype',
        component: UsersForm,
        props: true,
        meta: {
          title: 'Add User',
          type: 'add',
          layout: 'admin',
          requiresAuth: true,
          requiresAccess: true
        }
      },
      {
        path: '/boardingtype/edit/:id',
        name: 'usersEdit2',
        parent: 'boardingtype',
        component: UsersForm,
        props: true,
        meta: {
          title: 'Update User',
          layout: 'admin',
          requiresAuth: true,
          requiresAccess: true
        }
      },
      {
        path: '/boardingtype/pending',
        name: 'usersPending2',
        parent: 'boardingtype',
        component: PendingUsersTable,
        props: true,
        meta: {
          title: 'Pending Users',
          layout: 'admin',
          requiresAuth: true,
          requiresAccess: true
        }
      }
    ]
  }
];

export default userManagement2;