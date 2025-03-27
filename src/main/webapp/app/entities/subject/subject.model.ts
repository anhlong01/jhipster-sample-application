export interface ISubject {
  id: number;
  subjectDescription?: string | null;
}

export type NewSubject = Omit<ISubject, 'id'> & { id: null };
