import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Inline env + allowlist checks so Edge middleware does not import @/lib/* (Vercel
// flags those modules as unsupported in the Edge bundle). Logic matches
// src/lib/supabase/env.ts and src/lib/admin/allowlist.ts.
function getSupabasePublicEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

function isUserAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allow.includes(email.trim().toLowerCase());
}

const LOGIN = "/app/login";
const CALLBACK = "/app/auth/callback";
const SETUP = "/app/setup";
const MISCONFIGURED = "/app/misconfigured";
const ADMIN_LOGIN = "/admin/login";

function isAppPortalPath(pathname: string) {
  return pathname === "/app" || pathname.startsWith("/app/");
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isPublicAppPath(pathname: string) {
  return pathname === LOGIN || pathname.startsWith(CALLBACK);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const env = getSupabasePublicEnv();

  if (isAdminPath(pathname)) {
    if (!env) {
      if (pathname !== MISCONFIGURED) {
        return NextResponse.redirect(new URL(MISCONFIGURED, request.url));
      }
      return NextResponse.next();
    }

    let response = NextResponse.next({ request });
    const supabase = createServerClient(env.url, env.anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (pathname === ADMIN_LOGIN) {
      if (user) {
        if (isUserAdminEmail(user.email)) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/", request.url));
      }
      return response;
    }

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_LOGIN;
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (!isUserAdminEmail(user.email)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  }

  if (!isAppPortalPath(pathname)) {
    return NextResponse.next();
  }

  if (!env) {
    if (pathname !== MISCONFIGURED) {
      return NextResponse.redirect(new URL(MISCONFIGURED, request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isPublicAppPath(pathname)) {
    if (user && pathname === LOGIN) {
      return NextResponse.redirect(new URL("/app", request.url));
    }
    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (pathname === SETUP) {
    if (profile) {
      return NextResponse.redirect(new URL("/app", request.url));
    }
    return response;
  }

  if (!profile) {
    return NextResponse.redirect(new URL(SETUP, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/app", "/app/:path*", "/admin", "/admin/:path*"],
};
