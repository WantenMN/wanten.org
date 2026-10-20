import { Link } from "@tanstack/react-router";

import { AllPostInfo } from "@/lib/posts";

import { Separator } from "./ui/separator";

const PostList = ({ allPostInfo }: { allPostInfo: AllPostInfo }) => {
  return (
    <ul>
      {allPostInfo.map((post, index) => {
        const [year, month, day, slug] = post.slug.split("/").slice(1);
        return (
          <li key={post.id}>
            <Link
              className="text-foreground hover:text-foreground focus:text-foreground flex-1 text-lg font-medium hover:underline focus:underline"
              to="/$year/$month/$day/$slug"
              params={{ year, month, day, slug }}
            >
              {post.title}
            </Link>
            <span className="text-muted-foreground block text-sm">
              {(() => {
                const [datePart, timePart] = post.date.split(" ");
                const dateParts = datePart.split("-");
                const [yearPart, monthPart, dayPart] = dateParts;
                return (
                  <>
                    <Link
                      to="/$year"
                      params={{ year: yearPart }}
                      className="text-muted-foreground hover:text-foreground text-sm hover:underline"
                    >
                      {yearPart}
                    </Link>
                    -
                    <Link
                      to="/$year/$month"
                      params={{ year: yearPart, month: monthPart }}
                      className="text-muted-foreground hover:text-foreground text-sm hover:underline"
                    >
                      {monthPart}
                    </Link>
                    -
                    <Link
                      to="/$year/$month/$day"
                      params={{
                        year: yearPart,
                        month: monthPart,
                        day: dayPart,
                      }}
                      className="text-muted-foreground hover:text-foreground text-sm hover:underline"
                    >
                      {dayPart}
                    </Link>
                    {timePart && ` ${timePart}`}
                  </>
                );
              })()}
            </span>

            {index !== allPostInfo.length - 1 && <Separator />}
          </li>
        );
      })}
    </ul>
  );
};

export default PostList;
