import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import MarkResolve from './route/mark-routing-resolve.service';

const markRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/mark.component').then(m => m.MarkComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/mark-detail.component').then(m => m.MarkDetailComponent),
    resolve: {
      mark: MarkResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/mark-update.component').then(m => m.MarkUpdateComponent),
    resolve: {
      mark: MarkResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/mark-update.component').then(m => m.MarkUpdateComponent),
    resolve: {
      mark: MarkResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default markRoute;
