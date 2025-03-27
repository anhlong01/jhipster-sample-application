import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISubjectRegister } from '../subject-register.model';
import { SubjectRegisterService } from '../service/subject-register.service';

const subjectRegisterResolve = (route: ActivatedRouteSnapshot): Observable<null | ISubjectRegister> => {
  const id = route.params.id;
  if (id) {
    return inject(SubjectRegisterService)
      .find(id)
      .pipe(
        mergeMap((subjectRegister: HttpResponse<ISubjectRegister>) => {
          if (subjectRegister.body) {
            return of(subjectRegister.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default subjectRegisterResolve;
