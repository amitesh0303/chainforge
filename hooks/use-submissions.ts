'use client';
import { useState, useCallback } from 'react';
import type { SubmissionStatus } from '@/types';

interface SubmissionResult {
  status: SubmissionStatus;
  executionTimeMs?: number;
  gasUsed?: number;
  output?: string;
  error?: string;
}

export function useSubmissions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const submitCode = useCallback(async (problemId: string, code: string, language: string) => {
    setIsSubmitting(true);
    setResult(null);
    try {
      const response = await fetch('/api/judge0/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, code, language }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ status: 'runtime_error', error: String(error) });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submitCode, isSubmitting, result };
}
