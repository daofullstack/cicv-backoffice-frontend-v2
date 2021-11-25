const BoardingTypes = () => import('@/views/boardingTypeManagement/BoardingTypes');
const BoardingTypesTable = () => import('@/views/boardingTypeManagement/boardingTypes/Table');
const BoardingTypesForm = () => import('@/views/boardingTypeManagement/boardingTypes/Form');
const boardingTypeManagement = [
  {
    path: '/boardingtype',
    name: 'boardingtype',
    meta: { title: 'boardingType', layout: 'admin', requiresAuth: true },
    component: BoardingTypes,
    redirect: '/boardingtype/table',
    children: [
      {
        path: '/boardingtype/table',
        name: 'boardingTypesTable',
        parent: 'boardingtype',
        component: BoardingTypesTable,
        props: true,
        meta: {
          title: 'Types d\'embarquement',
          layout: 'admin',
          requiresAuth: true,
          requiresAccess: true
        }
      },
      {
        path: '/boardingtype/add',
        name: 'boardingTypesAdd',
        parent: 'boardingtype',
        component: BoardingTypesForm,
        props: true,
        meta: {
          title: 'Ajouter utilisateur',
          type: 'add',
          layout: 'admin',
          requiresAuth: true,
          requiresAccess: true
        }
      },
      {
        path: '/boardingtype/edit/:id',
        name: 'boardingTypesEdit',
        parent: 'boardingtype',
        component: BoardingTypesForm,
        props: true,
        meta: {
          title: 'Mettre à jour l\'utilisateur',
          layout: 'admin',
          requiresAuth: true,
          requiresAccess: true
        }
      }
    ]
  }
];

export default boardingTypeManagement;