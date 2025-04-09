import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes (e.g., admin routes)
const isAdminRoute = createRouteMatcher(['/admin(.*)', '/dashboard(.*)', '/online(.*)','/maps(.*)']);


export default clerkMiddleware(async (auth, req) => {
  // Protect admin routes
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    console.log('Session claims:', role);

    // if (role !== 'admin') {
    //   // Redirect non-admins to homepage
    //   return Response.redirect(new URL('/', req.url));
    // }
  }
});

export const config = {
  matcher: [
    // Apply middleware to all routes except static files and Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};