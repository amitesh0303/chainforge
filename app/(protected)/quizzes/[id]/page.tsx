import { QuizPage } from '@/components/quizzes/quiz-page';

export default async function Quiz({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QuizPage id={id} />;
}
