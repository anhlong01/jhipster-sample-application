import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import StudentResolve from './route/student-routing-resolve.service';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { MarkMapComponent } from './mark-map/mark-map.component';
const studentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/student.component').then(m => m.StudentComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/student-detail.component').then(m => m.StudentDetailComponent),
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/student-update.component').then(m => m.StudentUpdateComponent),
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/student-update.component').then(m => m.StudentUpdateComponent),
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/subject',
    loadComponent: () => import('./subject-list/subject-list.component').then(m => m.SubjectListComponent),
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/mark',
    loadComponent: () => import('./mark-map/mark-map.component').then(m => m.MarkMapComponent),
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/check',
    loadComponent: () => import('./check-pass/check-pass.component').then(m => m.CheckPassComponent),
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default studentRoute;
