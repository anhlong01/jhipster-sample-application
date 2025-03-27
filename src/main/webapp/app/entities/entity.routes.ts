import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'mark',
    data: { pageTitle: 'Marks' },
    loadChildren: () => import('./mark/mark.routes'),
  },
  {
    path: 'student',
    data: { pageTitle: 'Students' },
    loadChildren: () => import('./student/student.routes'),
  },
  {
    path: 'subject',
    data: { pageTitle: 'Subjects' },
    loadChildren: () => import('./subject/subject.routes'),
  },
  {
    path: 'subject-register',
    data: { pageTitle: 'SubjectRegisters' },
    loadChildren: () => import('./subject-register/subject-register.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
