import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ISubjectRegister } from '../subject-register.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../subject-register.test-samples';

import { SubjectRegisterService } from './subject-register.service';

const requireRestSample: ISubjectRegister = {
  ...sampleWithRequiredData,
};

describe('SubjectRegister Service', () => {
  let service: SubjectRegisterService;
  let httpMock: HttpTestingController;
  let expectedResult: ISubjectRegister | ISubjectRegister[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(SubjectRegisterService);
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

    it('should create a SubjectRegister', () => {
      const subjectRegister = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(subjectRegister).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SubjectRegister', () => {
      const subjectRegister = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(subjectRegister).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SubjectRegister', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SubjectRegister', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SubjectRegister', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSubjectRegisterToCollectionIfMissing', () => {
      it('should add a SubjectRegister to an empty array', () => {
        const subjectRegister: ISubjectRegister = sampleWithRequiredData;
        expectedResult = service.addSubjectRegisterToCollectionIfMissing([], subjectRegister);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subjectRegister);
      });

      it('should not add a SubjectRegister to an array that contains it', () => {
        const subjectRegister: ISubjectRegister = sampleWithRequiredData;
        const subjectRegisterCollection: ISubjectRegister[] = [
          {
            ...subjectRegister,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSubjectRegisterToCollectionIfMissing(subjectRegisterCollection, subjectRegister);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SubjectRegister to an array that doesn't contain it", () => {
        const subjectRegister: ISubjectRegister = sampleWithRequiredData;
        const subjectRegisterCollection: ISubjectRegister[] = [sampleWithPartialData];
        expectedResult = service.addSubjectRegisterToCollectionIfMissing(subjectRegisterCollection, subjectRegister);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subjectRegister);
      });

      it('should add only unique SubjectRegister to an array', () => {
        const subjectRegisterArray: ISubjectRegister[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const subjectRegisterCollection: ISubjectRegister[] = [sampleWithRequiredData];
        expectedResult = service.addSubjectRegisterToCollectionIfMissing(subjectRegisterCollection, ...subjectRegisterArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const subjectRegister: ISubjectRegister = sampleWithRequiredData;
        const subjectRegister2: ISubjectRegister = sampleWithPartialData;
        expectedResult = service.addSubjectRegisterToCollectionIfMissing([], subjectRegister, subjectRegister2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subjectRegister);
        expect(expectedResult).toContain(subjectRegister2);
      });

      it('should accept null and undefined values', () => {
        const subjectRegister: ISubjectRegister = sampleWithRequiredData;
        expectedResult = service.addSubjectRegisterToCollectionIfMissing([], null, subjectRegister, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subjectRegister);
      });

      it('should return initial array if no SubjectRegister is added', () => {
        const subjectRegisterCollection: ISubjectRegister[] = [sampleWithRequiredData];
        expectedResult = service.addSubjectRegisterToCollectionIfMissing(subjectRegisterCollection, undefined, null);
        expect(expectedResult).toEqual(subjectRegisterCollection);
      });
    });

    describe('compareSubjectRegister', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSubjectRegister(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 22971 };
        const entity2 = null;

        const compareResult1 = service.compareSubjectRegister(entity1, entity2);
        const compareResult2 = service.compareSubjectRegister(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 22971 };
        const entity2 = { id: 25952 };

        const compareResult1 = service.compareSubjectRegister(entity1, entity2);
        const compareResult2 = service.compareSubjectRegister(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 22971 };
        const entity2 = { id: 22971 };

        const compareResult1 = service.compareSubjectRegister(entity1, entity2);
        const compareResult2 = service.compareSubjectRegister(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
