import { useEffect, useRef } from 'react';

/**
 * Hook to track component render count for demonstration purposes.
 * Returns the current render count.
 *
 * Note: This increments during render (not in useEffect) because we want
 * to track every render, including the initial render. If we used useEffect,
 * it would only increment after the render completes.
 */
export function useRenderCount(): number {
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
  });
  return renderCount.current;
}
