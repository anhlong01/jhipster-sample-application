import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISubjectRegister, NewSubjectRegister } from '../subject-register.model';

export type PartialUpdateSubjectRegister = Partial<ISubjectRegister> & Pick<ISubjectRegister, 'id'>;

export type EntityResponseType = HttpResponse<ISubjectRegister>;
export type EntityArrayResponseType = HttpResponse<ISubjectRegister[]>;

@Injectable({ providedIn: 'root' })
export class SubjectRegisterService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/subject-registers');

  create(subjectRegister: NewSubjectRegister): Observable<EntityResponseType> {
    return this.http.post<ISubjectRegister>(this.resourceUrl, subjectRegister, { observe: 'response' });
  }

  update(subjectRegister: ISubjectRegister): Observable<EntityResponseType> {
    return this.http.put<ISubjectRegister>(`${this.resourceUrl}/${this.getSubjectRegisterIdentifier(subjectRegister)}`, subjectRegister, {
      observe: 'response',
    });
  }

  partialUpdate(subjectRegister: PartialUpdateSubjectRegister): Observable<EntityResponseType> {
    return this.http.patch<ISubjectRegister>(`${this.resourceUrl}/${this.getSubjectRegisterIdentifier(subjectRegister)}`, subjectRegister, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISubjectRegister>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISubjectRegister[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSubjectRegisterIdentifier(subjectRegister: Pick<ISubjectRegister, 'id'>): number {
    return subjectRegister.id;
  }

  compareSubjectRegister(o1: Pick<ISubjectRegister, 'id'> | null, o2: Pick<ISubjectRegister, 'id'> | null): boolean {
    return o1 && o2 ? this.getSubjectRegisterIdentifier(o1) === this.getSubjectRegisterIdentifier(o2) : o1 === o2;
  }

  addSubjectRegisterToCollectionIfMissing<Type extends Pick<ISubjectRegister, 'id'>>(
    subjectRegisterCollection: Type[],
    ...subjectRegistersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const subjectRegisters: Type[] = subjectRegistersToCheck.filter(isPresent);
    if (subjectRegisters.length > 0) {
      const subjectRegisterCollectionIdentifiers = subjectRegisterCollection.map(subjectRegisterItem =>
        this.getSubjectRegisterIdentifier(subjectRegisterItem),
      );
      const subjectRegistersToAdd = subjectRegisters.filter(subjectRegisterItem => {
        const subjectRegisterIdentifier = this.getSubjectRegisterIdentifier(subjectRegisterItem);
        if (subjectRegisterCollectionIdentifiers.includes(subjectRegisterIdentifier)) {
          return false;
        }
        subjectRegisterCollectionIdentifiers.push(subjectRegisterIdentifier);
        return true;
      });
      return [...subjectRegistersToAdd, ...subjectRegisterCollection];
    }
    console.log(subjectRegisterCollection);
    return subjectRegisterCollection;
  }
}
