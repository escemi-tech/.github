export type ResolvedResume = {
  basics?: { name?: string };
  certificates?: Array<{ issuer?: string }>;
} & Record<string, unknown>;

export function resolveResume(path: string): Promise<ResolvedResume>;
export function resolveResumeToFile(
  path: string,
): Promise<{ path: string; data: ResolvedResume }>;
