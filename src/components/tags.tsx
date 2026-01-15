import Link from "next/link";

const Tags = ({ tags, className }: { tags: string[]; className?: string }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`mt-1 ${className || ""}`}>
      {tags.map((tag, index) => (
        <span key={tag}>
          {index > 0 && <span className="text-sm text-zinc-400"> | </span>}
          <Link
            href={`/tags/${tag}`}
            className="text-sm text-zinc-400! hover:text-zinc-600! hover:underline"
          >
            {tag}
          </Link>
        </span>
      ))}
    </div>
  );
};

export default Tags;
