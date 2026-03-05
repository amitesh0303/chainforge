import { ProblemPage } from '@/components/problems/problem-page';

export default async function Problem({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProblemPage slug={slug} />;
}
