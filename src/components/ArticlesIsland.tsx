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
      className="relative py-4 px-3 rounded-lg border border-slate-200 dark:border-slate-800 transition-transform duration-700 hover:duration-100 ease-in-out overflow-hidden block"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100 pointer-events-none"
        style={{ backgroundImage: `url(${post.thumbnail})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-white/75 dark:bg-slate-900/75 pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative z-10 grid grid-cols-1 gap-y-2 items-start">
        <div className="min-w-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase mb-1">
            <span className="text-sky-500">&mdash;</span> {post.date} in{" "}
            <span
              className="text-sky-500 cursor-pointer hover:underline duration-150 ease-in-out"
              onClick={(e) => {
                e.preventDefault();
                onTagClick(post.tag);
              }}
            >
              {post.tag}
            </span>
          </div>
          <h3 className="font-aspekta text-lg font-[650] mb-1">
            {post.title}
          </h3>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {post.summary}
        </div>
      </div>
      <div className="absolute bottom-3 right-3 z-10 text-sky-500">
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
      <ul className="flex flex-wrap text-sm border-b border-slate-100 dark:border-slate-800 mb-3">
        {tags.map((tag) => (
          <li key={tag} className="px-2 -mb-px">
            <a
              className={`block py-2 capitalize cursor-pointer ${
                activeTag === tag
                  ? "font-medium text-slate-800 dark:text-slate-100 border-b-2 border-sky-500"
                  : "text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
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
        <div className="flex justify-center items-center gap-4 pt-6">
          {currentPage > 1 && (
            <a
              className="text-sky-500 hover:text-sky-400 cursor-pointer"
              onClick={() => fetchPage(activeTag, currentPage - 1, true)}
            >
              &lt; back
            </a>
          )}
          <span className="text-slate-500 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <a
              className="text-sky-500 hover:text-sky-400 cursor-pointer"
              onClick={() => fetchPage(activeTag, currentPage + 1, true)}
            >
              next &gt;
            </a>
          )}
        </div>
      )}
    </div>
  );
}
