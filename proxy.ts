import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkServerSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

function attachCookies(response: NextResponse, cookieHeader: string | null): NextResponse {
    if (cookieHeader) {
        response.headers.set("Cookie", cookieHeader);
    }

    return response;
}

export async function proxy(request: NextRequest) {
    const cookieStore = await cookies();
    const { pathname } = request.nextUrl;

    const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    let accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    let updatedCookieHeader: string | null = null;

    if (!accessToken && refreshToken) {
        try {
            const data = await checkServerSession();
            const setCookie = data.headers["set-cookie"];

            if (setCookie) {
                const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

                for (const cookieStr of cookieArray) {
                    const parsed = parse(cookieStr);
                    const options = {
                        expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                        path: parsed.Path,
                        maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
                    };

                    if (parsed.accessToken) {
                        cookieStore.set("accessToken", parsed.accessToken, options);
                        accessToken = parsed.accessToken;
                    }

                    if (parsed.refreshToken) {
                        cookieStore.set("refreshToken", parsed.refreshToken, options);
                    }
                }

                updatedCookieHeader = cookieStore.toString();
            }
        } catch {
            // Якщо refresh не вдався, просто продовжуємо перевірку маршруту
        }
    }

    if (isPublicRoute) {
        if (accessToken) {
            return attachCookies(
                NextResponse.redirect(new URL("/", request.url)),
                updatedCookieHeader
            );
        }

        return attachCookies(NextResponse.next(), updatedCookieHeader);
    }

    if (isPrivateRoute) {
        if (!accessToken) {
            return attachCookies(
                NextResponse.redirect(new URL("/sign-in", request.url)),
                updatedCookieHeader
            );
        }

        return attachCookies(NextResponse.next(), updatedCookieHeader);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};