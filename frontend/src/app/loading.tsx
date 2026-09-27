import { ThinkingIndicator } from '@/components/ThinkingIndicator';


export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background-full">
      <ThinkingIndicator />
      <p className="mt-4 animate-pulse text-body-medium text-text-tertiary">Memuat…</p>
    </div>
  );
}
