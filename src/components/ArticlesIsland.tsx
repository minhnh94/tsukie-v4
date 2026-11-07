import { useState, useCallback, useRef, useEffect } from "react";

interface Post {
  id: string;
  title: string;
  tag: string;
  slug: string;
  thumbnail: string;
  date: string;
  summary: string;
}

interface Props {
  initialItems: Post[];
  tags: string[];
  totalPages: number;
}

const TAG_LATEST = "latest";

const navBtn =
  "flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border text-strong-accent hover:border-strong-accent/60 hover:bg-muted transition-colors duration-150";

/** Pages to show: first, last, current ±1, with "…" for gaps. */
function pageRange(current: number, total: number): (number | "…")[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0) {
      const gap = p - sorted[i - 1];
      if (gap === 2) out.push(p - 1);
      else if (gap > 2) out.push("…");
    }
    out.push(p);
  });
  return out;
}

function ArticleCard({
  post,
  onTagClick,
}: {
  post: Post;
  onTagClick: (tag: string) => void;
}) {
  const href = `/en/${post.tag}/${post.slug}`;
  return (
    <a
      href={href}
      className="group relative py-4 px-3 night-card bg-card transition-transform duration-700 hover:duration-100 ease-in-out block"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: `url(${post.thumbnail})` }}
        aria-hidden="true"
      />
      <div className="relative z-10 grid grid-cols-1 gap-y-2 items-start">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground uppercase mb-1">
            <span className="text-strong-accent">&mdash;</span> {post.date} in{" "}
            <span
              className="text-strong-accent cursor-pointer hover:underline duration-150 ease-in-out"
              onClick={(e) => {
                e.preventDefault();
                onTagClick(post.tag);
              }}
            >
              {post.tag}
            </span>
          </div>
          <h3 className="relative inline-block font-aspekta text-lg font-[650] mb-1 group-hover:text-strong-accent duration-150 ease-in-out">
            {post.title}
          </h3>
        </div>
        <div className="text-sm text-muted-foreground pb-6">
          {post.summary}
        </div>
      </div>
      <div className="absolute bottom-3 right-3 z-10 text-strong-accent">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638l-3.96-4.158a.75.75 0 1 1 1.08-1.04l5.25 5.5a.75.75 0 0 1 0 1.04l-5.25 5.5a.75.75 0 1 1-1.08-1.04l3.96-4.158H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
        </svg>
      </div>
    </a>
  );
}

export default function ArticlesIsland({
  initialItems,
  tags,
  totalPages: initialTotalPages,
}: Props) {
  const [items, setItems] = useState<Post[]>(initialItems);
  const [activeTag, setActiveTag] = useState(TAG_LATEST);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const topRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef(false);

  useEffect(() => {
    if (pendingScroll.current) {
      pendingScroll.current = false;
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [items]);

  const fetchPage = useCallback(
    async (tag: string, page: number, scroll = false) => {
      try {
        const res = await fetch(`/api/posts/${tag}/${page}.json`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        if (scroll) pendingScroll.current = true;
        setItems(data.posts);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } catch (err) {
        console.error("Pagination fetch error:", err);
      }
    },
    [],
  );

  const handleTagClick = useCallback(
    (tag: string) => {
      setActiveTag(tag);
      fetchPage(tag, 1);
    },
    [fetchPage],
  );

  return (
    <div ref={topRef}>
      {/* Tab filters */}
      <ul className="flex flex-wrap text-sm border-b border-border mb-3">
        {tags.map((tag) => (
          <li key={tag} className="px-2 -mb-px">
            <a
              className={`block py-2 capitalize cursor-pointer ${
                activeTag === tag
                  ? "font-medium text-foreground border-b-2 border-strong-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </a>
          </li>
        ))}
      </ul>

      {/* Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((item) => (
          <ArticleCard key={item.id} post={item} onTagClick={handleTagClick} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex justify-center items-center gap-2 pt-8"
        >
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => fetchPage(activeTag, currentPage - 1, true)}
            className={`${navBtn} disabled:opacity-30 disabled:pointer-events-none`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
          </button>

          <ul className="flex items-center gap-1 px-1.5 py-1 rounded-full bg-card border border-border">
            {pageRange(currentPage, totalPages).map((p, i) =>
              p === "…" ? (
                <li key={`gap-${i}`} className="w-6 text-center text-xs text-muted-foreground select-none">
                  …
                </li>
              ) : (
                <li key={p}>
                  <button
                    type="button"
                    aria-label={`Page ${p}`}
                    aria-current={p === currentPage ? "page" : undefined}
                    onClick={() => p !== currentPage && fetchPage(activeTag, p, true)}
                    className={`w-8 h-8 rounded-full text-sm tabular-nums transition-colors duration-150 ${
                      p === currentPage
                        ? "bg-strong-accent text-primary-foreground font-semibold cursor-default"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                </li>
              ),
            )}
          </ul>

          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => fetchPage(activeTag, currentPage + 1, true)}
            className={`${navBtn} disabled:opacity-30 disabled:pointer-events-none`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
}
