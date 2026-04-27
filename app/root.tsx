import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  signIn as puterSignIn,
  signOut as puterSignOut,
} from "../lib/puter.action";
import { SITE_URL } from "../lib/constants";

const META_TITLE = "Roomify — AI floor plan visualization";
const META_DESCRIPTION =
  "Transform your 2D blueprints into realistic top-down visualizations with Roomify's AI-powered platform.";

export function meta(_args: Route.MetaArgs) {
  const ogImage = SITE_URL ? `${SITE_URL}/og.png` : "/og.png";

  const tags: Route.MetaDescriptors = [
    { title: META_TITLE },
    { name: "description", content: META_DESCRIPTION },
    { name: "theme-color", content: "#f97316" },
    { property: "og:title", content: META_TITLE },
    { property: "og:description", content: META_DESCRIPTION },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1731" },
    { property: "og:image:height", content: "909" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:site_name", content: "Roomify" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: META_TITLE },
    { name: "twitter:description", content: META_DESCRIPTION },
    { name: "twitter:image", content: ogImage },
  ];

  if (SITE_URL) {
    tags.push({ property: "og:url", content: SITE_URL });
  }

  return tags;
}

export const links: Route.LinksFunction = () => [
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
  { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "manifest", href: "/site.webmanifest" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const DEFAULT_AUTH_STATE: AuthState = {
  isSignedIn: false,
  userName: null,
  userId: null,
};

export default function App() {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE);

  const refreshAuth = async () => {
    try {
      const user = await getCurrentUser();

      setAuthState({
        isSignedIn: !!user,
        userName: user?.username || null,
        userId: user?.uuid || null,
      });

      return !!user;
    } catch {
      setAuthState(DEFAULT_AUTH_STATE);
      return false;
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const signIn = async () => {
    await puterSignIn();
    return await refreshAuth();
  };

  const signOut = async () => {
    puterSignOut();
    return await refreshAuth();
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative z-10">
      <Outlet context={{ ...authState, refreshAuth, signIn, signOut }} />;
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
