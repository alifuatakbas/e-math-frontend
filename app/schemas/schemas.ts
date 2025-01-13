// app/schemas/exam_schemas.ts
export interface QuestionSCH {
  id: number;
  text: string;
  options: string[];
}

export interface ExamSCH {
  id: number;
  title: string;
  is_published: boolean;
  questions: QuestionSCH[];
}