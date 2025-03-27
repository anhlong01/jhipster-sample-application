import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMark, NewMark } from '../mark.model';

export type PartialUpdateMark = Partial<IMark> & Pick<IMark, 'id'>;

export type EntityResponseType = HttpResponse<IMark>;
export type EntityArrayResponseType = HttpResponse<IMark[]>;

@Injectable({ providedIn: 'root' })
export class MarkService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/marks');

  create(mark: NewMark): Observable<EntityResponseType> {
    return this.http.post<IMark>(this.resourceUrl, mark, { observe: 'response' });
  }

  update(mark: IMark): Observable<EntityResponseType> {
    return this.http.put<IMark>(`${this.resourceUrl}/${this.getMarkIdentifier(mark)}`, mark, { observe: 'response' });
  }

  partialUpdate(mark: PartialUpdateMark): Observable<EntityResponseType> {
    return this.http.patch<IMark>(`${this.resourceUrl}/${this.getMarkIdentifier(mark)}`, mark, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMark>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMark[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMarkIdentifier(mark: Pick<IMark, 'id'>): number {
    return mark.id;
  }

  compareMark(o1: Pick<IMark, 'id'> | null, o2: Pick<IMark, 'id'> | null): boolean {
    return o1 && o2 ? this.getMarkIdentifier(o1) === this.getMarkIdentifier(o2) : o1 === o2;
  }

  addMarkToCollectionIfMissing<Type extends Pick<IMark, 'id'>>(
    markCollection: Type[],
    ...marksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const marks: Type[] = marksToCheck.filter(isPresent);
    if (marks.length > 0) {
      const markCollectionIdentifiers = markCollection.map(markItem => this.getMarkIdentifier(markItem));
      const marksToAdd = marks.filter(markItem => {
        const markIdentifier = this.getMarkIdentifier(markItem);
        if (markCollectionIdentifiers.includes(markIdentifier)) {
          return false;
        }
        markCollectionIdentifiers.push(markIdentifier);
        return true;
      });
      return [...marksToAdd, ...markCollection];
    }
    return markCollection;
  }
}
