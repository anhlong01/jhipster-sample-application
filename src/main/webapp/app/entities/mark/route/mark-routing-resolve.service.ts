import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMark } from '../mark.model';
import { MarkService } from '../service/mark.service';

const markResolve = (route: ActivatedRouteSnapshot): Observable<null | IMark> => {
  const id = route.params.id;
  if (id) {
    return inject(MarkService)
      .find(id)
      .pipe(
        mergeMap((mark: HttpResponse<IMark>) => {
          if (mark.body) {
            return of(mark.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default markResolve;
