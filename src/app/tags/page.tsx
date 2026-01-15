import Link from "next/link";
import { getAllTags } from "@/lib/posts";
import { BASE_TITLE } from "@/config/constants";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: `Tags - ${BASE_TITLE}`,
  };
}

const Page = () => {
  const tags = getAllTags();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Tags</h1>
      <ul>
        {tags.map((tag) => (
          <li key={tag.tag} className="mb-2">
            <Link
              href={`/tags/${tag.tag}`}
              className="text-lg font-medium text-zinc-800 hover:text-black hover:underline focus:text-black focus:underline"
            >
              {tag.tag} ({tag.count})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
