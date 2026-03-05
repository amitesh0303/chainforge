import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { submitCode, getSubmissionResult, JUDGE0_LANGUAGE_IDS } from '@/lib/judge0/client';

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.email ?? session.user.name ?? 'anonymous';
  if (!checkRateLimit(userId)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { code, language, stdin } = await req.json();
  const languageId = JUDGE0_LANGUAGE_IDS[language as keyof typeof JUDGE0_LANGUAGE_IDS] ?? 73;

  try {
    const token = await submitCode({
      source_code: code,
      language_id: languageId,
      stdin: stdin ?? '',
      cpu_time_limit: 10,
      memory_limit: 128000,
    });

    // Poll for result
    let result = null;
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      result = await getSubmissionResult(token);
      if (result.status.id > 2) break;
    }

    const statusMap: Record<number, string> = {
      3: 'accepted',
      4: 'wrong_answer',
      5: 'time_limit_exceeded',
      6: 'compilation_error',
      11: 'runtime_error',
    };

    return NextResponse.json({
      status: statusMap[result?.status.id ?? 0] ?? 'runtime_error',
      output: result?.stdout,
      error: result?.stderr ?? result?.compile_output,
      executionTimeMs: result?.time ? Math.round(parseFloat(result.time) * 1000) : undefined,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Execution failed', details: String(error) }, { status: 500 });
  }
}
