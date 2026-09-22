import { Renew } from '@carbon/icons-react';
import { ThinkingIndicator } from '@/components/ThinkingIndicator';


export default function Loading() {
  return (
    <div className="min-h-screen bg-[#EFEFEF] flex flex-col items-center justify-center">
      <ThinkingIndicator />
      <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">Memuat...</p>
    </div>
  );
}
