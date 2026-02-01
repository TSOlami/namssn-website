import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

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
