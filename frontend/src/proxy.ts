import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // Client-side layouts (RecruiterLayout & CandidateLayout) handle auth verification via /auth/me
    return NextResponse.next();
}

export const config = {
    matcher: ['/recruiter/:path*', '/candidate/:path*'],
};
