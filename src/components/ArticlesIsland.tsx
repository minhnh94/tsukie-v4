import { useState, useCallback } from 'react';

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

const TAG_LATEST = 'latest';

function ArticleCard({ post, onTagClick }: { post: Post; onTagClick: (tag: string) => void }) {
  const href = `en/${post.tag}/${post.slug}`;
  return (
    <article className="py-5 border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-start">
        <img
          className="rounded w-16 h-16 sm:w-[88px] sm:h-[88px] object-cover mr-6"
          src={post.thumbnail}
          width={88}
          height={88}
          alt={post.title}
          loading="lazy"
        />
        <div>
          <div className="text-xs text-slate-500 uppercase mb-1">
            <span className="text-sky-500">&mdash;</span> {post.date} in{' '}
            <span
              className="text-sky-500 cursor-pointer hover:underline duration-150 ease-in-out"
              onClick={() => onTagClick(post.tag)}
            >
              {post.tag}
            </span>
          </div>
          <h3 className="font-aspekta text-lg font-[650] mb-1">
            <a
              className="inline-flex relative hover:text-sky-500 duration-150 ease-out before:scale-x-0 before:origin-center before:absolute before:inset-0 before:bg-sky-200 dark:before:bg-sky-500 before:opacity-30 before:-z-10 before:translate-y-1/4 before:-rotate-2 hover:before:scale-100 before:duration-150 before:ease-in-out"
              href={href}
            >
              {post.title}
            </a>
          </h3>
          <div className="flex">
            <div className="grow text-sm text-slate-500 dark:text-slate-400">{post.summary}</div>
            <a
              className="hidden lg:flex shrink-0 text-sky-500 items-center justify-center w-12 group"
              href={href}
              tabIndex={-1}
            >
              <svg
                className="fill-current group-hover:translate-x-2 duration-150 ease-in-out"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="12"
              >
                <path d="M9.586 5 6.293 1.707 7.707.293 13.414 6l-5.707 5.707-1.414-1.414L9.586 7H0V5h9.586Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ArticlesIsland({ initialItems, tags, totalPages: initialTotalPages }: Props) {
  const [items, setItems] = useState<Post[]>(initialItems);
  const [activeTag, setActiveTag] = useState(TAG_LATEST);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const fetchPage = useCallback(async (tag: string, page: number) => {
    try {
      const res = await fetch(`/api/posts/${tag}/${page}.json`);
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setItems(data.posts);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      console.error('Pagination fetch error:', err);
    }
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setActiveTag(tag);
    fetchPage(tag, 1);
  }, [fetchPage]);

  return (
    <div>
      {/* Tab filters */}
      <ul className="flex flex-wrap text-sm border-b border-slate-100 dark:border-slate-800">
        {tags.map((tag) => (
          <li key={tag} className="px-3 -mb-px">
            <a
              className={`block py-3 capitalize cursor-pointer ${
                activeTag === tag
                  ? 'font-medium text-slate-800 dark:text-slate-100 border-b-2 border-sky-500'
                  : 'text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </a>
          </li>
        ))}
      </ul>

      {/* Articles */}
      <div>
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
              onClick={() => fetchPage(activeTag, currentPage - 1)}
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
              onClick={() => fetchPage(activeTag, currentPage + 1)}
            >
              next &gt;
            </a>
          )}
        </div>
      )}
    </div>
  );
}
