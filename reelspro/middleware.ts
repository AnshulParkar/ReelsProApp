import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                //Allow auth related urls
                if (pathname.startsWith("/api/auth") || pathname.startsWith("/login") || pathname.startsWith("/register")) {
                    return true;
                }

                //public
                if (pathname.startsWith("/") || pathname.startsWith("/api/video")) {
                    return true;
                }

                return !!token;// Check if the user is authenticated
            }
        }
    }
);

export const config = {
    matcher: [
        "/((?!api/auth|login|register).*)", // Match all routes except auth-related ones
    ],
};
