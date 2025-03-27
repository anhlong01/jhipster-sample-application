import { IMark, NewMark } from './mark.model';

export const sampleWithRequiredData: IMark = {
  id: 28468,
};

export const sampleWithPartialData: IMark = {
  id: 14731,
  score: 8299.37,
};

export const sampleWithFullData: IMark = {
  id: 2767,
  score: 2159.71,
};

export const sampleWithNewData: NewMark = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
