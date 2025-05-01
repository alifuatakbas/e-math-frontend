// app/schemas/exam_schemas.ts
export interface QuestionSCH {
  id: number;
  text: string;
  options: string[];
  image?: string;        // Eklendi
}

export interface ExamSCH {
  id: number;
  title: string;
  is_published: boolean;
  questions: QuestionSCH[];
}

// Yeni interface'ler
export interface ExamStatus {
  registration_pending: 'registration_pending';
  registration_open: 'registration_open';
  exam_active: 'exam_active';
  completed: 'completed';
}

export type ExamStatusType = 'registration_pending' | 'registration_open' | 'exam_active' | 'completed';

export interface ExamStatus {
  [key: string]: ExamStatusType;
}

export interface ExamResponse extends ExamSCH {
  registration_start_date: string;
  registration_end_date: string;
  exam_start_date: string;
  exam_end_date: string;
  is_registered: boolean;
  can_register: boolean;
  status: ExamStatusType;  // keyof ExamStatus yerine ExamStatusType
  registration_status: string;
}