import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IMark } from '../mark.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../mark.test-samples';

import { MarkService } from './mark.service';

const requireRestSample: IMark = {
  ...sampleWithRequiredData,
};

describe('Mark Service', () => {
  let service: MarkService;
  let httpMock: HttpTestingController;
  let expectedResult: IMark | IMark[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(MarkService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Mark', () => {
      const mark = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mark).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mark', () => {
      const mark = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mark).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mark', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mark', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Mark', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMarkToCollectionIfMissing', () => {
      it('should add a Mark to an empty array', () => {
        const mark: IMark = sampleWithRequiredData;
        expectedResult = service.addMarkToCollectionIfMissing([], mark);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mark);
      });

      it('should not add a Mark to an array that contains it', () => {
        const mark: IMark = sampleWithRequiredData;
        const markCollection: IMark[] = [
          {
            ...mark,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMarkToCollectionIfMissing(markCollection, mark);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mark to an array that doesn't contain it", () => {
        const mark: IMark = sampleWithRequiredData;
        const markCollection: IMark[] = [sampleWithPartialData];
        expectedResult = service.addMarkToCollectionIfMissing(markCollection, mark);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mark);
      });

      it('should add only unique Mark to an array', () => {
        const markArray: IMark[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const markCollection: IMark[] = [sampleWithRequiredData];
        expectedResult = service.addMarkToCollectionIfMissing(markCollection, ...markArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mark: IMark = sampleWithRequiredData;
        const mark2: IMark = sampleWithPartialData;
        expectedResult = service.addMarkToCollectionIfMissing([], mark, mark2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mark);
        expect(expectedResult).toContain(mark2);
      });

      it('should accept null and undefined values', () => {
        const mark: IMark = sampleWithRequiredData;
        expectedResult = service.addMarkToCollectionIfMissing([], null, mark, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mark);
      });

      it('should return initial array if no Mark is added', () => {
        const markCollection: IMark[] = [sampleWithRequiredData];
        expectedResult = service.addMarkToCollectionIfMissing(markCollection, undefined, null);
        expect(expectedResult).toEqual(markCollection);
      });
    });

    describe('compareMark', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMark(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 24153 };
        const entity2 = null;

        const compareResult1 = service.compareMark(entity1, entity2);
        const compareResult2 = service.compareMark(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 24153 };
        const entity2 = { id: 20546 };

        const compareResult1 = service.compareMark(entity1, entity2);
        const compareResult2 = service.compareMark(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 24153 };
        const entity2 = { id: 24153 };

        const compareResult1 = service.compareMark(entity1, entity2);
        const compareResult2 = service.compareMark(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
