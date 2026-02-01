import { useCallback, useRef, useEffect } from 'react';

const DEFAULT_ROOT_MARGIN = '100px';

/**
 * Reusable infinite scroll hook using IntersectionObserver.
 * When the sentinel element enters view (within rootMargin), loadMore() is called.
 * Mirrors the pattern used in kiki (ProductGrid, bookmarks): one sentinel ref, observer
 * only fires loadMore when hasNextPage && !isLoadingMore.
 *
 * @param {Object} options
 * @param {() => void} options.loadMore - Called when sentinel is visible
 * @param {boolean} options.hasNextPage - Only trigger when true
 * @param {boolean} options.isLoadingMore - Do not trigger while loading next page
 * @param {string} [options.rootMargin='100px'] - IntersectionObserver rootMargin
 * @param {number} [options.threshold=0] - IntersectionObserver threshold
 * @returns {{ sentinelRef: (node: HTMLElement | null) => void }} ref to attach to the sentinel element
 */
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
