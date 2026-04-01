import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { isUserAdminEmail } from "@/lib/admin/allowlist";

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
