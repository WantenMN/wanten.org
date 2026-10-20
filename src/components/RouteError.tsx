import { Link, useRouterState } from "@tanstack/react-router";

import { BASE_TITLE } from "@/config/constants";

export function RouteError({ error }: { error: unknown }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 text-center">
      <h1 className="text-foreground mb-4 text-4xl font-bold">
        Something went wrong
      </h1>
      <p className="text-muted-foreground text-lg">
        {error instanceof Error ? error.message : `Failed to load ${pathname}`}
      </p>
      <p className="mt-6">
        <Link to="/" className="text-foreground text-lg underline">
          Back to {BASE_TITLE}
        </Link>
      </p>
    </div>
  );
}
