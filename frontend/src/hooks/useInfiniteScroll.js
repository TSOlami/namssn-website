import { useCallback, useRef, useEffect } from 'react';

const DEFAULT_ROOT_MARGIN = '100px';

export function useInfiniteScroll({
  loadMore,
  hasNextPage,
  isLoadingMore,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = 0,
}) {
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  const handleIntersect = useCallback(
    (entries) => {
      const [entry] = entries;
      if (!entry?.isIntersecting) return;
      if (!hasNextPage || isLoadingMore) return;
      loadMore();
    },
    [loadMore, hasNextPage, isLoadingMore]
  );

  const setRef = useCallback(
    (node) => {
      const prev = sentinelRef.current;
      if (observerRef.current && prev) {
        observerRef.current.unobserve(prev);
        observerRef.current = null;
      }
      sentinelRef.current = node;
      if (!node) return;
      observerRef.current = new IntersectionObserver(handleIntersect, {
        root: null,
        rootMargin,
        threshold,
      });
      observerRef.current.observe(node);
    },
    [handleIntersect, rootMargin, threshold]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current && sentinelRef.current) {
        observerRef.current.unobserve(sentinelRef.current);
      }
      observerRef.current = null;
    };
  }, []);

  return { sentinelRef: setRef };
}
