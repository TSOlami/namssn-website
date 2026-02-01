import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

/**
 * Invisible sentinel div for infinite scroll. Place at the end of a list;
 * when it enters view, onLoadMore is called (if hasNextPage and not loading).
 * Same pattern as kiki ProductGrid / bookmarks: single ref, IntersectionObserver.
 */
export function InfiniteScrollSentinel({
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  rootMargin = '100px',
  className = 'h-4 w-full',
}) {
  const { sentinelRef } = useInfiniteScroll({
    loadMore: onLoadMore,
    hasNextPage: !!hasNextPage,
    isLoadingMore: !!isLoadingMore,
    rootMargin,
  });

  if (!hasNextPage) return null;

  return <div ref={sentinelRef} className={className} aria-hidden="true" />;
}
