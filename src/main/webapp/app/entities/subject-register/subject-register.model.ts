import { IStudent } from 'app/entities/student/student.model';
import { ISubject } from 'app/entities/subject/subject.model';

export interface ISubjectRegister {
  id: number;
  student?: IStudent | null;
  subject?: ISubject | null;
}

export type NewSubjectRegister = Omit<ISubjectRegister, 'id'> & { id: null };
