import { Renew } from '@carbon/icons-react';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';


export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F7F9F9] flex flex-col items-center justify-center">
      <ThinkingIndicator />
      <p className="mt-4 text-brand-gray-dark font-medium animate-pulse">Loading...</p>
    </div>
  );
}
