const PrincipalComponent = () => import('@/views/colisTypeManagement/ColisType');
const Table = () => import('@/views/colisTypeManagement/colisType/Table');
const Form = () => import('@/views/colisTypeManagement/colisType/Form');

const colisTypeManagement = [
  {
    path: '/colistype',
    name: 'colisType',
    meta: { title: 'Gestion des types de colis', layout: 'admin', requiresAuth: true },
    component: PrincipalComponent,
    redirect: '/colistype/table',
    children: [
      {
        path: '/colistype/table',
        name: 'colisTypeTable',
        parent: 'colisType',
        component: Table,
        props: true,
        meta: {
          title: 'Liste des Types colis',
          layout: 'admin',
          requiresAuth: true,
          requiresAccess: true
        }
      },
      {
        path: '/colistype/add',
        name: 'colisTypeAdd',
        parent: 'colisType',
        component: Form,
        props: true,
        meta: {
          title: 'Ajouter un colis Type',
          type: 'add',
          layout: 'admin',
          requiresAuth: true,
          requiresAccess: true
        }
      },
      {
        path: '/colistype/edit/:id',
        name: 'colisTypeEdit',
        parent: 'colisType',
        component: Form,
        props: true,
        meta: {
          title: 'Mise à jour',
          layout: 'admin',
          requiresAuth: true,
          requiresAccess: true
        }
      }
    ]
  }
];

export default colisTypeManagement;