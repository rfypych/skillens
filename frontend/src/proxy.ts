import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const path = request.nextUrl.pathname;
    
    // Protect recruiter and candidate routes, except public candidate portals
    const isPublicCandidateRoute = path.startsWith('/candidate/apply') || 
                                   path.startsWith('/candidate/instructions') || 
                                   path.startsWith('/candidate/job');

    if (!token && !isPublicCandidateRoute && (path.startsWith('/recruiter') || path.startsWith('/candidate'))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/recruiter/:path*', '/candidate/:path*', '/login', '/signup'],
};
