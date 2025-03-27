import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 15380,
};

export const sampleWithPartialData: IStudent = {
  id: 9314,
  studentName: 'muted',
  studentClass: 'psst',
  studentKhoahoc: 'indeed accessorise searchingly',
};

export const sampleWithFullData: IStudent = {
  id: 6617,
  studentName: 'pleasant plain petty',
  sex: 'indeed',
  studentClass: 'including abscond',
  studentKhoahoc: 'certification specific as',
  dob: dayjs('2025-03-24'),
};

export const sampleWithNewData: NewStudent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
