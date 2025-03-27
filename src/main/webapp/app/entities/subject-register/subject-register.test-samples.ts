import { ISubjectRegister, NewSubjectRegister } from './subject-register.model';

export const sampleWithRequiredData: ISubjectRegister = {
  id: 29633,
};

export const sampleWithPartialData: ISubjectRegister = {
  id: 15361,
};

export const sampleWithFullData: ISubjectRegister = {
  id: 26999,
};

export const sampleWithNewData: NewSubjectRegister = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
