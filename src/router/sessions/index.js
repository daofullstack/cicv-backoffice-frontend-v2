const Login = () => import('@/views/sessions/Login');
const Register = () => import('@/views/sessions/Register');
const ActivatePage = () => import('@/views/sessions/ActivatePage');
const ForgotPassword = () => import('@/views/sessions/ForgotPassword');
const ResetPassword = () => import('@/views/sessions/ResetPassword');

const sessions = [
  {
    path: '/login',
    name: 'login',
    meta: { title: 'Se connecter', requiresAuth: false, default: true },
    component: Login
  },
  {
    path: '/logout',
    name: 'logout',
    meta: { title: 'Se connecter', requiresAuth: true, default: true },
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    meta: { title: 'S\'inscrire', requiresAuth: false, default: true },
    component: Register
  },
  {
    path: '/activate/:token',
    name: 'activatePage',
    meta: { title: 'Activer l\'utilisateur', requiresAuth: false, default: true },
    component: ActivatePage
  },
  {
    path: '/forgot-password',
    name: 'forgotPassword',
    meta: { title: 'Mot de passe oublier', requiresAuth: false, default: true },
    component: ForgotPassword
  },
  {
    path: '/reset-password/:token',
    name: 'resetPassword',
    meta: { title: 'Réinitialiser le mot de passe', requiresAuth: false, default: true },
    component: ResetPassword
  }
];

export default sessions;