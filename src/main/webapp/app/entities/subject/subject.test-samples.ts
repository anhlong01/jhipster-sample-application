import { ISubject, NewSubject } from './subject.model';

export const sampleWithRequiredData: ISubject = {
  id: 18046,
};

export const sampleWithPartialData: ISubject = {
  id: 31257,
};

export const sampleWithFullData: ISubject = {
  id: 6439,
  subjectDescription: 'supportive satirize gripping',
};

export const sampleWithNewData: NewSubject = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
