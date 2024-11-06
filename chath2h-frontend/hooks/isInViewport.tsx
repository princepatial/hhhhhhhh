import { MutableRefObject, useEffect, useRef, useState } from 'react';

const useIsInViewport = (ref: MutableRefObject<HTMLElement | null> | HTMLDivElement | null) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry.isIntersecting)
    );
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !observerRef.current) return;
    if (ref && 'current' in ref) {
      ref.current ? observerRef.current.observe(ref.current) : null;
    } else if (ref) {
      observerRef.current.observe(ref);
    }

    return () => {
      if (!observerRef.current) return;
      observerRef.current.disconnect();
    };
  }, [ref, observerRef]);

  return isIntersecting;
};

export default useIsInViewport;
