export const JUDGE0_LANGUAGE_IDS = {
  solidity: 101,
  rust: 73,
  move: 90,
} as const;

export interface Judge0SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

export interface Judge0SubmissionResult {
  token: string;
  status: {
    id: number;
    description: string;
  };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string | null;
  memory: number | null;
}

export async function submitCode(request: Judge0SubmissionRequest): Promise<string> {
  const response = await fetch(
    `${process.env.JUDGE0_API_URL ?? 'https://judge0-ce.p.rapidapi.com'}/submissions?base64_encoded=false&wait=false`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY ?? '',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify(request),
    }
  );
  const data = await response.json();
  return data.token;
}

export async function getSubmissionResult(token: string): Promise<Judge0SubmissionResult> {
  const response = await fetch(
    `${process.env.JUDGE0_API_URL ?? 'https://judge0-ce.p.rapidapi.com'}/submissions/${token}?base64_encoded=false`,
    {
      headers: {
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY ?? '',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
    }
  );
  return response.json();
}
