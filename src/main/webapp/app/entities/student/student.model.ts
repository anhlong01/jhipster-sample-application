import dayjs from 'dayjs/esm';

export interface IStudent {
  id: number;
  studentName?: string | null;
  sex?: string | null;
  studentClass?: string | null;
  studentKhoahoc?: string | null;
  dob?: dayjs.Dayjs | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
