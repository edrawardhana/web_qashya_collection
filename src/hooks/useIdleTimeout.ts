import { useEffect, useRef } from 'react';

const EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;

export function useIdleTimeout(timeoutMs: number, onTimeout: () => void): void {
  const callback = useRef(onTimeout);
  callback.current = onTimeout;

  useEffect(() => {
    let timer = window.setTimeout(() => callback.current(), timeoutMs);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => callback.current(), timeoutMs);
    };
    EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      EVENTS.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [timeoutMs]);
}