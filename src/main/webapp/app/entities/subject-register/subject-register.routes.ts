import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import SubjectRegisterResolve from './route/subject-register-routing-resolve.service';

const subjectRegisterRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/subject-register.component').then(m => m.SubjectRegisterComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/subject-register-detail.component').then(m => m.SubjectRegisterDetailComponent),
    resolve: {
      subjectRegister: SubjectRegisterResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/subject-register-update.component').then(m => m.SubjectRegisterUpdateComponent),
    resolve: {
      subjectRegister: SubjectRegisterResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/subject-register-update.component').then(m => m.SubjectRegisterUpdateComponent),
    resolve: {
      subjectRegister: SubjectRegisterResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default subjectRegisterRoute;
