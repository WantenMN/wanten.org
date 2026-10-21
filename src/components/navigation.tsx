import { Link, useRouterState } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import { RssIcon, UserRoundIcon } from "./icons";

import { Separator } from "./ui/separator";
import { ThemeToggle } from "./theme-toggle";

const Navigation = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const pages = [
    {
      title: "",
      path: "/rss.xml",
      icon: "Rss",
    },
    {
      title: "About",
      path: "/about",
      icon: "UserRound",
    },
  ];

  return (
    <nav className="flex w-full items-center justify-between select-none">
      <Link to="/" className={cn("")} title="Home">
        <img src="/favicon.ico" alt="Home" width={24} height={24} />
      </Link>

      <ul className="text-muted-foreground flex leading-none">
        <li className="flex">
          <ThemeToggle />
          <Separator orientation="vertical" />
        </li>
        {pages.map((page, index) => (
          <li key={index} className="flex">
            {page.icon === "Rss" ? (
              <a
                href={page.path}
                className="hover:text-foreground flex items-center"
                title="RSS Feed"
              >
                <RssIcon size={16} />
              </a>
            ) : (
              <Link
                to="/about"
                className={cn("hover:text-foreground flex items-center", {
                  "text-foreground underline": pathname === page.path,
                })}
                title={page.title}
              >
                <UserRoundIcon size={16} />
              </Link>
            )}
            {index !== pages.length - 1 ? (
              <Separator orientation="vertical" />
            ) : (
              <></>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
