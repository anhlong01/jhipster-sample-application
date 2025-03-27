import { ISubjectRegister } from 'app/entities/subject-register/subject-register.model';

export interface IMark {
  id: number;
  score?: number | null;
  subjectRegister?: ISubjectRegister | null;
}

export type NewMark = Omit<IMark, 'id'> & { id: null };
